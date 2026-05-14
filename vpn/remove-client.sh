#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_common.sh"

# ---------- usage ----------

usage() {
    echo "Usage: sudo $0 [-f|--force] <client-name>"
    echo ""
    echo "  -f, --force  Skip confirmation prompt (useful for scripts)."
    echo ""
    echo "Example: sudo $0 alice"
    exit 1
}

FORCE=0
NAME=""

for arg in "$@"; do
    case "$arg" in
        -f|--force) FORCE=1 ;;
        -*)         usage ;;
        *)          [[ -z "$NAME" ]] && NAME="$arg" || usage ;;
    esac
done

[[ -n "$NAME" ]] || usage

check_root
validate_client_name "$NAME"

[[ -f "$WG_CONF" ]] || die "${WG_CONF} not found — has the server been set up?"

client_exists "$NAME" || die "Client '${NAME}' does not exist. Use list-clients.sh to see all clients."

# ---------- confirm ----------

if [[ $FORCE -eq 0 ]]; then
    warn "This will permanently remove client '${NAME}' and revoke its access."
    read -r -p "Continue? [y/N] " reply
    [[ "$reply" =~ ^[Yy]$ ]] || { info "Aborted."; exit 0; }
fi

# ---------- acquire lock ----------

exec 200>"${WG_LOCK}"
flock -n 200 || die "Another add/remove operation is already in progress. Please wait."

# ---------- remove peer block from wg0.conf ----------

sed -i "/^### BEGIN ${NAME}$/,/^### END ${NAME}$/d" "${WG_CONF}"

# Remove any blank lines that may have been left between blocks
sed -i '/^$/N;/^\n$/d' "${WG_CONF}"

# Verify removal
client_exists "$NAME" && die "Removal failed — peer block for '${NAME}' is still present in ${WG_CONF}."
success "Removed peer block for '${NAME}' from ${WG_CONF}."

# ---------- remove client config ----------

CLIENT_CONF="${WG_CLIENTS_DIR}/${NAME}.conf"
if [[ -f "$CLIENT_CONF" ]]; then
    rm -f "${CLIENT_CONF}"
    success "Deleted ${CLIENT_CONF}."
else
    warn "Client config ${CLIENT_CONF} not found (may have been deleted already)."
fi

# ---------- hot-reload ----------

hot_reload

success "Client '${NAME}' removed. Their access is revoked immediately."
