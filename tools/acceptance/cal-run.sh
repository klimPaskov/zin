set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
R=/home/klim/.local/share/zin-acceptance-20261015
bash "$HERE/zin-live.sh" sync | tail -1
rm -f "$R/profile/logs/error.log" "$R/profile/logs/text.log" "$R/profile/logs/game.log"
bash "$HERE/run.sh" "${1:-cal}" 0 0 "${2:-180}" | tail -1
mkdir -p "$HERE/work/logs-${1:-cal}"
cp "$R/profile/logs/error.log" "$R/profile/logs/text.log" "$R/profile/logs/game.log" "$HERE/work/logs-${1:-cal}/" 2>/dev/null
echo "error.log lines: $(wc -l < "$HERE/work/logs-${1:-cal}/error.log")"
