# usage: run.sh <label> <portraitX> <portraitY> [runSeconds]
# As run3.sh, but after the start it unpauses at top speed and keeps the clock running, checking the game is alive
# every 30 seconds (the Windows crash of 19 October came seconds into a running game). Captures before stopping.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
Z="$HERE/zin-live.sh"
label=$1; px=$2; py=$3; secs=${4:-600}
lease() { [[ "$(cat /tmp/hoi4_wsl.lock 2>/dev/null)" == zin_acceptance_20261015 ]]; }
click() { lease || exit 9; DISPLAY=:96 xdotool mousemove "$1" "$2"; sleep .3; DISPLAY=:96 xdotool mousedown 1; sleep .4; DISPLAY=:96 xdotool mouseup 1; }
key() { lease || exit 9; DISPLAY=:96 xdotool key "$1"; sleep .5; }
alive() { bash "$Z" status | head -1 | grep -qv stopped; }
bash "$Z" start || exit 1
sleep 110; alive || { echo DIED-AT-MENU; bash "$Z" stop; exit 2; }
click 800 200; sleep 20
click 800 330; sleep 150; alive || { echo DIED-AT-SETUP; bash "$Z" stop; exit 2; }
if [[ "$px" != 0 ]]; then click "$px" "$py"; fi; sleep 15
bash "$Z" capture "$label-select"
click 884 786; sleep 150; alive || { echo DIED-AT-MAP; bash "$Z" stop; exit 2; }
click 1458 858; sleep 240; alive || { echo DIED-AFTER-START; bash "$Z" stop; exit 2; }
bash "$Z" capture "$label-started"
# Unpause and raise the speed to the top (speed 5).
sleep 2
key space; for i in 1 2 3 4; do key KP_Add; done
elapsed=0
while (( elapsed < secs )); do sleep 30; elapsed=$((elapsed + 30)); alive || { echo "DIED-RUNNING after ${elapsed}s"; bash "$Z" stop; exit 2; }; done
bash "$Z" capture "$label-running"
echo "ALIVE-RUNNING ${secs}s"
bash "$Z" stop
