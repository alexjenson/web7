#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_common.sh"

check_root

echo ""
echo "${_BOLD}=== WireGuard Interface ===${_RESET}"
echo ""

if wg_is_running; then
    wg show "${WG_IFACE}" 2>/dev/null || warn "wg show returned an error."
else
    warn "Interface ${WG_IFACE} is NOT running."
fi

echo ""
echo "${_BOLD}=== systemd Service ===${_RESET}"
echo ""
systemctl status "wg-quick@${WG_IFACE}" --no-pager -l 2>/dev/null || true

echo ""
echo "${_BOLD}=== Summary ===${_RESET}"
echo ""

if wg_is_running; then
    PEER_COUNT=$(wg show "${WG_IFACE}" peers 2>/dev/null | grep -c . || echo 0)
    success "Interface ${WG_IFACE} is UP — ${PEER_COUNT} peer(s) configured."
    exit 0
else
    warn "Interface ${WG_IFACE} is DOWN."
    info  "Start it with:  sudo systemctl start wg-quick@${WG_IFACE}"
    exit 2
fi
