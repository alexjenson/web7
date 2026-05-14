#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_common.sh"

# ---------- usage ----------

usage() {
    echo "Usage: sudo $0 <client-name>"
    echo ""
    echo "  client-name  Alphanumeric, hyphens, underscores; max 32 chars."
    echo ""
    echo "Example: sudo $0 alice"
    exit 1
}

[[ $# -eq 1 ]] || usage

NAME="$1"

check_root
validate_client_name "$NAME"

[[ -f "$WG_CONF" ]]       || die "${WG_CONF} not found — run setup-server.sh first."
[[ -f "$WG_SERVER_ENV" ]] || die "${WG_SERVER_ENV} not found — run setup-server.sh first."

# shellcheck disable=SC1090
source "${WG_SERVER_ENV}"

client_exists "$NAME" && die "Client '${NAME}' already exists. Use list-clients.sh to see all clients."

# ---------- acquire lock ----------

exec 200>"${WG_LOCK}"
flock -n 200 || die "Another add/remove operation is already in progress. Please wait."

# ---------- assign IP ----------

CLIENT_IP=$(next_client_ip)
info "Assigning VPN IP: ${CLIENT_IP}"

# ---------- generate client keys ----------

umask 077
CLIENT_PRIVKEY=$(wg genkey)
CLIENT_PUBKEY=$(echo "${CLIENT_PRIVKEY}" | wg pubkey)
CLIENT_PSK=$(wg genpsk)
success "Client keypair and preshared key generated."

# ---------- update wg0.conf ----------

cat >> "${WG_CONF}" <<EOF

### BEGIN ${NAME}
[Peer]
# Name        = ${NAME}
PublicKey    = ${CLIENT_PUBKEY}
PresharedKey = ${CLIENT_PSK}
AllowedIPs   = ${CLIENT_IP}/32
### END ${NAME}
EOF

success "Added peer block for '${NAME}' to ${WG_CONF}."

# ---------- write client config ----------

mkdir -p "${WG_CLIENTS_DIR}"
CLIENT_CONF="${WG_CLIENTS_DIR}/${NAME}.conf"

cat > "${CLIENT_CONF}" <<EOF
[Interface]
# Name      = ${NAME}
Address    = ${CLIENT_IP}/32
PrivateKey = ${CLIENT_PRIVKEY}
DNS        = ${CLIENT_DNS}

[Peer]
# Server
PublicKey           = ${SERVER_PUBKEY}
PresharedKey        = ${CLIENT_PSK}
Endpoint            = ${SERVER_IP}:${WG_PORT}
AllowedIPs          = 0.0.0.0/0
PersistentKeepalive = ${KEEPALIVE}
EOF

chmod 600 "${CLIENT_CONF}"
success "Wrote client config: ${CLIENT_CONF}"

# ---------- hot-reload server ----------

hot_reload

# ---------- QR code ----------

echo ""
if command -v qrencode &>/dev/null; then
    info "Scan this QR code with the WireGuard mobile app:"
    echo ""
    qrencode -t ansiutf8 < "${CLIENT_CONF}"
    echo ""
else
    warn "qrencode not found — skipping QR code. Install with: apt-get install qrencode"
fi

# ---------- summary ----------

echo "  ${_BOLD}Client name  :${_RESET} ${NAME}"
echo "  ${_BOLD}VPN IP       :${_RESET} ${CLIENT_IP}"
echo "  ${_BOLD}Config file  :${_RESET} ${CLIENT_CONF}"
echo ""
info "Transfer ${CLIENT_CONF} to the client device, or scan the QR code above."
