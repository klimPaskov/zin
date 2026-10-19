#!/usr/bin/env bash
# Private ZIN acceptance harness, explicitly permitted by this repository's AGENTS.md.
set -euo pipefail
zin_runtime=/home/klim/.local/share/zin-acceptance-20261015
zin_game=/home/klim/games/hoi4
zin_source='/mnt/c/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin'
zin_lease=zin_acceptance_20261015
export DISPLAY=:96
unset WAYLAND_DISPLAY
export SDL_VIDEODRIVER=x11 SDL_VIDEO_WINDOW_POS=0,0 SDL_AUDIODRIVER=dummy
export GALLIUM_DRIVER=llvmpipe LIBGL_ALWAYS_SOFTWARE=1
require_lease() { [[ -f /tmp/hoi4_wsl.lock && "$(cat /tmp/hoi4_wsl.lock)" == "$zin_lease" ]]; }
owned_pid() {
  local kind="$1" expected="$2" pid
  [[ -f "$zin_runtime/$kind.pid" ]] || return 1
  pid=$(cat "$zin_runtime/$kind.pid")
  [[ "$pid" =~ ^[0-9]+$ && -r /proc/$pid/comm && "$(cat /proc/$pid/comm)" == "$expected" ]] || return 1
  ! grep -q '^State:.*Z' /proc/$pid/status || return 1
  printf '%s' "$pid"
}
case "${1:-status}" in
sync)
  if pgrep -x hoi4 >/dev/null; then echo 'A Linux game is running; refusing sync'; exit 1; fi
  ZIN_RUNTIME="$zin_runtime" ZIN_SOURCE="$zin_source" python3 - <<'PY'
import pathlib,os,json,hashlib,shutil,time
runtime=pathlib.Path(os.environ['ZIN_RUNTIME']).resolve()
dest=(runtime/'profile/mod/zin').resolve()
source=pathlib.Path(os.environ['ZIN_SOURCE']).resolve()
assert dest == pathlib.Path('/home/klim/.local/share/zin-acceptance-20261015/profile/mod/zin')
def entries(root):
 # Map generator outputs plus overhaul content (separate manifest so a map rebuild never removes content).
 files={f['relativePath']:f['sha256'] for f in json.loads((root/'.hoi4-agent-world.json').read_text())['files']}
 content=root/'.zin-content.json'
 if content.exists(): files.update({f['relativePath']:f['sha256'] for f in json.loads(content.read_text())['files']})
 return files
old,new=entries(dest),entries(source)
def target(root,name):
 p=(root/name).resolve()
 assert p.is_relative_to(root) and p!=root
 return p
for name,digest in old.items():
 p=target(dest,name)
 if p.exists(): assert hashlib.sha256(p.read_bytes()).hexdigest()==digest, 'Edited private file: '+name
for name,digest in new.items():
 p=target(source,name)
 assert hashlib.sha256(p.read_bytes()).hexdigest()==digest, 'Stale source: '+name
for name in old.keys()-new.keys():
 p=target(dest,name)
 if p.exists(): p.unlink()
for name in [*new,'.hoi4-agent-world.json','descriptor.mod',*(['.zin-content.json'] if (source/'.zin-content.json').exists() else [])]:
 p=target(dest,name);p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(target(source,name),p)
d=(dest/'descriptor.mod').read_text()
(runtime/'profile/mod/zin.mod').write_text(d+'\npath="'+str(dest)+'"\n')
logs=runtime/'profile/logs'
if logs.exists(): shutil.copytree(logs,runtime/'evidence'/('logs-'+str(time.time_ns())))
print('Synced',len(new),'managed ZIN files; removed',len(old.keys()-new.keys()),'obsolete outputs')
PY
  ;;
prepare)
  [[ -f "$zin_source/map/provinces.bmp" ]] || { echo 'Generated ZIN map is missing'; exit 1; }
  [[ ! -e "$zin_runtime/profile" ]] || { echo 'Private profile already exists; refusing to replace it'; exit 1; }
  mkdir -p "$zin_runtime/profile/mod/zin" "$zin_runtime/evidence"
  rsync -a --exclude='.git' --exclude='.tmp' --exclude='docs/reference/originals' "$zin_source/" "$zin_runtime/profile/mod/zin/"
  ZIN_RUNTIME="$zin_runtime" python3 - <<'PY'
import pathlib,os,json
p=pathlib.Path(os.environ['ZIN_RUNTIME'])/'profile'
d=(p/'mod/zin/descriptor.mod').read_text()
(p/'mod/zin.mod').write_text(d+'\npath="'+str(p/'mod/zin')+'"\n')
(p/'dlc_load.json').write_text(json.dumps({'disabled_dlcs':[],'enabled_mods':['mod/zin.mod']}))
(p/'settings.txt').write_text('''language="l_english"
graphics={ size={ x=1600 y=900 } min_gui={ x=1280 y=720 } gui_scale=1.0 fullScreen=no borderless=no multi_sampling=0 vsync=no shadows=no }
master_volume=0
music_volume=0
corner_scrolling=no
autosave="NEVER"
autosave_tocloud=no
save_career_to_cloud=no
save_as_binary=no
telemetry_enabled=no
hints=no
mapRenderingOptions={ draw_terrain=yes draw_water=yes draw_borders=yes draw_trees=yes draw_rivers=yes draw_postfx=no draw_citysprawl=yes draw_shadows=no draw_weather_effects=no draw_water_reflections=no draw_units=yes draw_buildings=yes high_gfx_shaders=no draw_map_full_res=yes texture_quality=1 }
''')
(p/'pdx_settings.txt').write_text('''"Graphics"={
"display_mode"={ value="windowed" version=0 }
"windowed_resolution"={ value="1600x900" version=0 }
"renderer"={ value="opengl" version=0 }
"vsync"={ enabled=no version=0 }
}
"System"={ "language"={ value="l_english" version=0 } }
''')
PY
  echo 'Prepared isolated Linux ZIN profile'
  ;;
start)
  [[ -f "$zin_runtime/profile/mod/zin/map/provinces.bmp" ]]
  if pgrep -x hoi4 >/dev/null; then echo 'Linux HOI4 already running; leaving it untouched'; exit 1; fi
  if xwininfo -root >/dev/null 2>&1; then echo 'Display :96 occupied'; exit 1; fi
  (set -o noclobber; printf '%s\n' "$zin_lease" > /tmp/hoi4_wsl.lock) || { echo 'Shared game lease unavailable'; exit 1; }
  nohup Xvfb :96 -screen 0 1600x900x24 -nolisten tcp -noreset >"$zin_runtime/xvfb.log" 2>&1 </dev/null &
  echo $! >"$zin_runtime/xvfb.pid"
  for i in $(seq 1 50); do xwininfo -root >/dev/null 2>&1 && break; sleep .1; done
  glxinfo -B >"$zin_runtime/renderer.txt" 2>&1 || true
  cd "$zin_game"
  nohup ./hoi4 -debug -nofilewatcher -userdir="$zin_runtime/profile" >"$zin_runtime/hoi4.stdout.log" 2>&1 </dev/null &
  echo $! >"$zin_runtime/hoi4.pid"
  printf 'Started ZIN PID %s, profile %s\n' "$(cat "$zin_runtime/hoi4.pid")" "$zin_runtime/profile"
  ;;
capture)
  require_lease
  pid=$(owned_pid hoi4 hoi4)
  [[ "${2:-}" =~ ^[a-z0-9_-]+$ ]]
  window=$(xdotool search --onlyvisible --pid "$pid" | tail -1)
  import -display "$DISPLAY" -window "$window" "$zin_runtime/evidence/$2.png"
  echo "$zin_runtime/evidence/$2.png"
  ;;
status)
  for pair in 'hoi4 hoi4' 'xvfb Xvfb'; do read -r kind comm <<<"$pair"; echo "$kind: $(owned_pid "$kind" "$comm" || echo stopped)"; done
  xwininfo -root -tree 2>/dev/null || true
  ;;
stop)
  require_lease
  pid=$(owned_pid hoi4 hoi4 || true)
  if [[ -n "$pid" ]]; then
    kill -TERM "$pid"
    for i in $(seq 1 50); do owned_pid hoi4 hoi4 >/dev/null || break; sleep .2; done
    if owned_pid hoi4 hoi4 >/dev/null; then echo 'Owned game has not exited; retaining display and lease'; exit 1; fi
  fi
  pid=$(owned_pid xvfb Xvfb || true)
  [[ -z "$pid" ]] || kill -TERM "$pid"
  require_lease && rm -- /tmp/hoi4_wsl.lock
  ;;
*) exit 2 ;;
esac
