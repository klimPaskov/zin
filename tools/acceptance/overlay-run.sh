set -u
# One start in the isolated Linux profile: materialise an overlay (live-base overlays = the live mod), start with
# run3.sh (bookmark default), copy logs, print the crash folder's top stack frames if the game crashed, restore the
# profile copy to the live mod with the normal sync.
#   overlay-run.sh <label> <overlayDir> [runSeconds]
label=$1; ov=$2
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
S="$HERE/work"
Z="$HERE/zin-live.sh"
R=/home/klim/.local/share/zin-acceptance-20261015
before=$(ls "$R/profile/crashes" | wc -l)
bash "$HERE/overlay-sync.sh" "$S/$ov" | tail -1 || { echo OVERLAY-SYNC-FAILED; exit 1; }
rm -f "$R/profile/logs/error.log" "$R/profile/logs/text.log" "$R/profile/logs/game.log"
result=$(bash "$HERE/run.sh" "$label" 0 0 "${3:-600}" | tail -1)
echo "$label: $result"
mkdir -p "$S/logs-$label"
cp "$R/profile/logs/error.log" "$R/profile/logs/text.log" "$R/profile/logs/game.log" "$S/logs-$label/" 2>/dev/null
echo "  error.log lines: $(wc -l < "$S/logs-$label/error.log")"
if [ "$(ls "$R/profile/crashes" | wc -l)" -gt "$before" ]; then c=$(ls -t "$R/profile/crashes" | head -1); echo "  crash $c: $(grep -m1 signal "$R/profile/crashes/$c/exception.txt") top frames $(grep -A3 'Original Stack' "$R/profile/crashes/$c/exception.txt" | tail -3 | sed 's/ \[.*//' | tr '\n' ' ')"; fi
for i in $(seq 1 60); do pgrep -x hoi4 >/dev/null || break; sleep 2; done
[ -f /tmp/hoi4_wsl.lock ] && [ "$(cat /tmp/hoi4_wsl.lock)" = zin_acceptance_20261015 ] && ! pgrep -x hoi4 >/dev/null && bash "$Z" stop
pgrep -x hoi4 >/dev/null && { echo "  game still running; not restoring"; exit 3; }
bash "$Z" sync | tail -1 | sed 's/^/  /'
