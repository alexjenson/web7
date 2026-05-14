#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_common.sh"

check_root
check_os

command -v wg &>/dev/null || die "WireGuard is not installed. Run  sudo ./install.sh  first."

# ---------- overwrite guard ----------

if [[ -f "$WG_CONF" ]]; then
    warn "${WG_CONF} already exists."
    read -r -p "Overwrite and reconfigure? All existing peers will be lost. [y/N] " reply
    [[ "$reply" =~ ^[Yy]$ ]] || { info "Aborted."; exit 0; }
fi

# ---------- gather config values ----------

NIC=$(detect_nic)
info "Detected network interface: ${NIC}"

info "Detecting server public IP..."
SERVER_IP=$(detect_server_ip)
info "Server public IP: ${SERVER_IP}"

# ---------- generate server keys ----------

umask 077
SERVER_PRIVKEY=$(wg genkey)
SERVER_PUBKEY=$(echo "${SERVER_PRIVKEY}" | wg pubkey)
success "Server keypair generated."

# ---------- write wg0.conf ----------

cat > "${WG_CONF}" <<EOF
# WireGuard server — managed by vpn scripts. Do not edit manually.
# Server public key: ${SERVER_PUBKEY}

[Interface]
Address    = ${VPN_SERVER_IP}/24
ListenPort = ${WG_PORT}
PrivateKey = ${SERVER_PRIVKEY}
SaveConfig = false

PostUp   = iptables -A FORWARD -i %i -j ACCEPT; \\
           iptables -A FORWARD -o %i -j ACCEPT; \\
           iptables -t nat -A POSTROUTING -o ${NIC} -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; \\
           iptables -D FORWARD -o %i -j ACCEPT; \\
           iptables -t nat -D POSTROUTING -o ${NIC} -j MASQUERADE
EOF

chmod 600 "${WG_CONF}"
success "Wrote ${WG_CONF}"

# ---------- write server.env (used by add-client.sh) ----------

cat > "${WG_SERVER_ENV}" <<EOF
SERVER_PUBKEY="${SERVER_PUBKEY}"
SERVER_IP="${SERVER_IP}"
EOF

chmod 600 "${WG_SERVER_ENV}"
success "Wrote ${WG_SERVER_ENV}"

# ---------- firewall ----------

if command -v ufw &>/dev/null && ufw status 2>/dev/null | grep -q "Status: active"; then
    ufw allow "${WG_PORT}/udp" &>/dev/null
    success "ufw: allowed UDP ${WG_PORT}."
else
    iptables -C INPUT -p udp --dport "${WG_PORT}" -j ACCEPT 2>/dev/null \
        || iptables -A INPUT -p udp --dport "${WG_PORT}" -j ACCEPT
    success "iptables: opened UDP ${WG_PORT}."
    warn "Raw iptables rules do not survive reboots. Install 'iptables-persistent' or enable ufw to make them permanent."
fi

# ---------- enable & start service ----------

systemctl enable --now "wg-quick@${WG_IFACE}" &>/dev/null
success "Enabled and started wg-quick@${WG_IFACE}."

# ---------- verify ----------

sleep 1
wg show "${WG_IFACE}" &>/dev/null || die "Interface ${WG_IFACE} failed to come up. Check: journalctl -u wg-quick@${WG_IFACE}"

echo ""
success "WireGuard server is running."
echo ""
echo "  ${_BOLD}Server public key :${_RESET} ${SERVER_PUBKEY}"
echo "  ${_BOLD}Server public IP  :${_RESET} ${SERVER_IP}"
echo "  ${_BOLD}VPN subnet        :${_RESET} 10.0.0.0/24  (server = ${VPN_SERVER_IP})"
echo "  ${_BOLD}Listen port       :${_RESET} ${WG_PORT}/udp"
echo ""
info "Next step: sudo ./add-client.sh <name>"
