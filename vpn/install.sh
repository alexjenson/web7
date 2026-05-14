#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_common.sh"

check_root
check_os

# ---------- idempotency ----------

if command -v wg &>/dev/null; then
    warn "WireGuard is already installed ($(wg --version 2>/dev/null | head -1)). Skipping package install."
else
    info "Installing WireGuard..."

    # shellcheck disable=SC1091
    . /etc/os-release

    apt-get update -qq

    if [[ "$ID" == "debian" ]]; then
        local_dver=$(cut -d. -f1 /etc/debian_version)
        if [[ "$local_dver" == "11" ]]; then
            info "Debian 11 detected — adding bullseye-backports for WireGuard..."
            BACKPORTS_LIST="/etc/apt/sources.list.d/bullseye-backports.list"
            if [[ ! -f "$BACKPORTS_LIST" ]]; then
                echo "deb http://deb.debian.org/debian bullseye-backports main" > "$BACKPORTS_LIST"
                apt-get update -qq
            fi
            DEBIAN_FRONTEND=noninteractive apt-get install -y -t bullseye-backports \
                wireguard wireguard-tools qrencode
        else
            DEBIAN_FRONTEND=noninteractive apt-get install -y wireguard wireguard-tools qrencode
        fi
    else
        DEBIAN_FRONTEND=noninteractive apt-get install -y wireguard wireguard-tools qrencode
    fi

    success "WireGuard installed: $(wg --version 2>/dev/null | head -1)"
fi

# ---------- IP forwarding ----------

SYSCTL_CONF="/etc/sysctl.d/99-wireguard.conf"
if [[ ! -f "$SYSCTL_CONF" ]]; then
    info "Enabling IP forwarding..."
    cat > "$SYSCTL_CONF" <<'EOF'
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
EOF
    sysctl --system -q
else
    info "IP forwarding sysctl file already present, reloading..."
    sysctl --system -q
fi

current_fwd=$(sysctl -n net.ipv4.ip_forward 2>/dev/null || echo 0)
[[ "$current_fwd" == "1" ]] || die "IP forwarding could not be enabled (got '${current_fwd}')."
success "IP forwarding is active."

# ---------- directories ----------

mkdir -p "${WG_DIR}" "${WG_CLIENTS_DIR}"
chmod 700 "${WG_DIR}" "${WG_CLIENTS_DIR}"
success "Directories created with restricted permissions."

echo ""
success "Installation complete."
info "Next step: run  sudo ./setup-server.sh"
