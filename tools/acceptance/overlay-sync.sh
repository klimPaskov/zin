#!/usr/bin/env bash
# Materialise "live ZIN + test overlay" into the isolated Linux profile copy only (never the live mod, never Windows).
# Mirrors .tmp/zin-live.sh sync: the profile copy must match its own manifests before it is changed, and it is left
# matching the overlay's manifests, so a later normal `zin-live.sh sync` restores the live mod state.
#   overlay-sync.sh <overlayDir (WSL path)>
set -euo pipefail
overlay=$1
zin_runtime=/home/klim/.local/share/zin-acceptance-20261015
zin_source='/mnt/c/Users/klimp/OneDrive/Documents/Paradox Interactive/Hearts of Iron IV/mod/zin'
if pgrep -x hoi4 >/dev/null; then echo 'A Linux game is running; refusing overlay sync'; exit 1; fi
ZIN_RUNTIME="$zin_runtime" ZIN_SOURCE="$zin_source" ZIN_OVERLAY="$overlay" python3 - <<'PY'
import pathlib,os,json,hashlib,shutil
runtime=pathlib.Path(os.environ['ZIN_RUNTIME']).resolve()
dest=(runtime/'profile/mod/zin').resolve()
source=pathlib.Path(os.environ['ZIN_SOURCE']).resolve()
overlay=pathlib.Path(os.environ['ZIN_OVERLAY']).resolve()
assert dest == pathlib.Path('/home/klim/.local/share/zin-acceptance-20261015/profile/mod/zin')
def manifest(p): return {f['relativePath']:f['sha256'] for f in json.loads(p.read_text())['files']}
def entries(root):
  files=manifest(root/'.hoi4-agent-world.json')
  if (root/'.zin-content.json').exists(): files.update(manifest(root/'.zin-content.json'))
  return files
def inside(root,name):
  p=(root/name).resolve(); assert p.is_relative_to(root) and p!=root; return p
old=entries(dest)
new=manifest(overlay/'world.json'); new.update(manifest(overlay/'content.json'))
for name,digest in old.items():
  p=inside(dest,name)
  if p.exists(): assert hashlib.sha256(p.read_bytes()).hexdigest()==digest, 'Edited private file: '+name
base=(overlay.parent/(overlay/'base.txt').read_text().strip()).resolve() if (overlay/'base.txt').exists() else None
def src(name):
  o=inside(overlay/'files',name)
  if o.exists(): return o
  if base is not None:
    b=inside(base/'files',name)
    if b.exists(): return b
  return inside(source,name)
copied=0
for name,digest in new.items():
  s=src(name); b=s.read_bytes(); assert hashlib.sha256(b).hexdigest()==digest, 'Stale overlay source: '+name
  p=inside(dest,name)
  if p.exists() and hashlib.sha256(p.read_bytes()).hexdigest()==digest: continue
  p.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(s,p); copied+=1
removed=0
for name in old.keys()-new.keys():
  p=inside(dest,name)
  if p.exists(): p.unlink(); removed+=1
shutil.copy2(overlay/'world.json',dest/'.hoi4-agent-world.json')
shutil.copy2(overlay/'content.json',dest/'.zin-content.json')
d=(dest/'descriptor.mod').read_text()
(runtime/'profile/mod/zin.mod').write_text(d+'\npath="'+str(dest)+'"\n')
print('Overlay synced',len(new),'managed files; copied',copied,'removed',removed,'replace_path',d.count('replace_path'))
PY
