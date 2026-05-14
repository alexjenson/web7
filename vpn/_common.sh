#!/bin/bash
# Shared constants and helper functions — source this file, do not execute directly.

readonly WG_IFACE="wg0"
readonly WG_DIR="/etc/wireguard"
readonly WG_CONF="${WG_DIR}/wg0.conf"
readonly WG_CLIENTS_DIR="${WG_DIR}/clients"
readonly WG_SERVER_ENV="${WG_DIR}/server.env"
readonly WG_LOCK="${WG_DIR}/.add-lock"
readonly WG_PORT=51820
readonly VPN_SERVER_IP="10.0.0.1"
readonly VPN_MAX_OCTET=254
readonly CLIENT_DNS="1.1.1.1"
readonly KEEPALIVE=25

# ---------- colour helpers ----------

if [ -t 2 ] && command -v tput &>/dev/null && tput colors &>/dev/null; then
    _RED=$(tput setaf 1)    _GREEN=$(tput setaf 2)
    _YELLOW=$(tput setaf 3) _CYAN=$(tput setaf 6)
    _BOLD=$(tput bold)      _RESET=$(tput sgr0)
else
    _RED='' _GREEN='' _YELLOW='' _CYAN='' _BOLD='' _RESET=''
fi

die()     { echo "${_RED}[ERROR]${_RESET} $*" >&2; exit 1; }
info()    { echo "${_CYAN}[INFO]${_RESET}  $*" >&2; }
success() { echo "${_GREEN}[OK]${_RESET}    $*" >&2; }
warn()    { echo "${_YELLOW}[WARN]${_RESET}  $*" >&2; }

# ---------- guards ----------

check_root() {
    [[ $EUID -ne 0 ]] && die "This script must be run as root.  Try: sudo $0 $*"
}

check_os() {
    [[ -f /etc/os-release ]] || die "Cannot read /etc/os-release — unsupported OS."
    # shellcheck disable=SC1091
    . /etc/os-release
    case "$ID" in
        ubuntu)
            local min="20.04"
            if [[ "$(printf '%s\n' "$min" "$VERSION_ID" | sort -V | head -1)" != "$min" ]]; then
                die "Ubuntu ${min}+ required; detected Ubuntu ${VERSION_ID}."
            fi
            ;;
        debian)
            local dver
            dver=$(cut -d. -f1 /etc/debian_version 2>/dev/null || echo 0)
            [[ $dver -ge 11 ]] || die "Debian 11 (bullseye) or newer required; detected Debian ${dver}."
            ;;
        *)
            die "Unsupported OS '${ID}'. Only Ubuntu 20.04+ and Debian 11+ are supported."
            ;;
    esac
}

# ---------- network helpers ----------

detect_nic() {
    local nic
    nic=$(ip route show default 2>/dev/null | awk '/^default/ {print $5; exit}')
    [[ -n "$nic" ]] || die "Could not detect default network interface. Is the server online?"
    echo "$nic"
}

detect_server_ip() {
    local ip=""
    ip=$(curl -4 -s --max-time 5 https://api.ipify.org 2>/dev/null) && [[ -n "$ip" ]] && { echo "$ip"; return; }
    ip=$(curl -4 -s --max-time 5 https://ifconfig.me 2>/dev/null)   && [[ -n "$ip" ]] && { echo "$ip"; return; }
    ip=$(hostname -I 2>/dev/null | awk '{print $1}')                 && [[ -n "$ip" ]] && { echo "$ip"; return; }
    die "Could not determine server public IP. Set SERVER_IP manually in ${WG_SERVER_ENV} after setup."
}

# ---------- WireGuard helpers ----------

wg_is_running() {
    systemctl is-active --quiet "wg-quick@${WG_IFACE}" 2>/dev/null
}

hot_reload() {
    if wg_is_running; then
        wg syncconf "${WG_IFACE}" <(wg-quick strip "${WG_IFACE}") \
            || die "wg syncconf failed — check 'wg show' for details."
        success "Hot-reloaded ${WG_IFACE} (no connections dropped)."
    else
        info "Interface ${WG_IFACE} is not running; changes will apply on next start."
    fi
}

# Returns the next available VPN IP (e.g. 10.0.0.3)
next_client_ip() {
    [[ -f "$WG_CONF" ]] || die "${WG_CONF} not found — run setup-server.sh first."
    local max
    max=$(grep -oP '10\.0\.0\.\K[0-9]+(?=/32)' "${WG_CONF}" 2>/dev/null | sort -n | tail -1)
    max=${max:-1}   # 1 = server address; first client gets .2
    local next=$(( max + 1 ))
    [[ $next -le $VPN_MAX_OCTET ]] || die "Subnet exhausted — maximum of $((VPN_MAX_OCTET - 1)) clients reached."
    echo "10.0.0.${next}"
}

# Returns 0 if a peer block for $1 exists in wg0.conf, 1 otherwise
client_exists() {
    local name="$1"
    grep -qP "^### BEGIN ${name}$" "${WG_CONF}" 2>/dev/null
}

validate_client_name() {
    local name="$1"
    [[ -n "$name" ]]                           || die "Client name must not be empty."
    [[ ${#name} -le 32 ]]                      || die "Client name must be 32 characters or fewer."
    [[ "$name" =~ ^[a-zA-Z0-9_-]+$ ]]         || die "Client name must contain only letters, digits, hyphens, or underscores."
}
