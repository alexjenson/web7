#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_common.sh"

check_root

[[ -f "$WG_CONF" ]] || die "${WG_CONF} not found — has the server been set up?"

# ---------- parse clients from wg0.conf ----------

mapfile -t NAMES < <(grep -oP '(?<=^### BEGIN ).*' "${WG_CONF}" 2>/dev/null || true)

if [[ ${#NAMES[@]} -eq 0 ]]; then
    info "No clients configured yet. Add one with:  sudo ./add-client.sh <name>"
    exit 0
fi

declare -A CLIENT_PUBKEY CLIENT_IP

while IFS= read -r line; do
    if [[ "$line" =~ ^###\ BEGIN\ (.+)$ ]]; then
        current_name="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^PublicKey[[:space:]]*=[[:space:]]*(.+)$ ]]; then
        CLIENT_PUBKEY["${current_name:-}"]="${BASH_REMATCH[1]}"
    elif [[ "$line" =~ ^AllowedIPs[[:space:]]*=[[:space:]]*(.+)/32$ ]]; then
        CLIENT_IP["${current_name:-}"]="${BASH_REMATCH[1]}"
    fi
done < "${WG_CONF}"

# ---------- gather live data from wg show ----------

declare -A LAST_HS LIVE_ENDPOINT

if wg_is_running; then
    while IFS=$'\t' read -r pubkey _psk endpoint _allowed last_hs _rx _tx _ka; do
        LAST_HS["$pubkey"]="$last_hs"
        LIVE_ENDPOINT["$pubkey"]="$endpoint"
    done < <(wg show "${WG_IFACE}" dump 2>/dev/null | tail -n +2 || true)
fi

# ---------- format last handshake epoch ----------

format_handshake() {
    local epoch="$1"
    if [[ -z "$epoch" || "$epoch" == "0" ]]; then
        echo "never"
        return
    fi
    local now
    now=$(date +%s)
    local delta=$(( now - epoch ))
    if [[ $delta -lt 60 ]]; then
        echo "${delta}s ago"
    elif [[ $delta -lt 3600 ]]; then
        echo "$(( delta / 60 ))m ago"
    elif [[ $delta -lt 86400 ]]; then
        echo "$(( delta / 3600 ))h ago"
    else
        echo "$(date -d "@${epoch}" "+%Y-%m-%d %H:%M" 2>/dev/null || date -r "${epoch}" "+%Y-%m-%d %H:%M")"
    fi
}

# ---------- print table ----------

IFACE_STATUS="(offline)"
wg_is_running && IFACE_STATUS="online"

printf "\n  WireGuard interface ${_BOLD}${WG_IFACE}${_RESET} [%s]  —  %d client(s)\n\n" \
    "$IFACE_STATUS" "${#NAMES[@]}"

printf "  %-20s %-14s %-26s %s\n" "NAME" "VPN IP" "ENDPOINT" "LAST HANDSHAKE"
printf "  %-20s %-14s %-26s %s\n" "----" "------" "--------" "--------------"

for name in "${NAMES[@]}"; do
    pubkey="${CLIENT_PUBKEY[$name]:-}"
    ip="${CLIENT_IP[$name]:-unknown}"

    hs_epoch="${LAST_HS[$pubkey]:-}"
    handshake=$(format_handshake "$hs_epoch")

    endpoint="${LIVE_ENDPOINT[$pubkey]:-}"
    [[ -z "$endpoint" ]] && endpoint="(not connected)"

    printf "  %-20s %-14s %-26s %s\n" "$name" "$ip" "$endpoint" "$handshake"
done

echo ""
