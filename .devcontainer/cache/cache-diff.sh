#!/usr/bin/env bash

# Ётот файл используетс€ дл€ архивировани€ копии всех различий в исходном дереве, в другое место образа.
#  ак только кодовое пространство / контейнер будет работать, это будет восстановлено в надлежащем месте.

set -e

SCRIPT_PATH="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
SOURCE_FOLDER="${1:-"."}"
CACHE_FOLDER="${2:-"/usr/local/etc/devcontainer-cache"}"

echo "[$(date)] «апуск операции с кешем ..."
cd "${SOURCE_FOLDER}"
echo "[$(date)] ќпределение различий ..."
find -L . -not -path "*/.git/*" -and -not -path "${SCRIPT_PATH}/*.manifest" -type f > "${SCRIPT_PATH}/after.manifest"
grep -Fxvf  "${SCRIPT_PATH}/before.manifest" "${SCRIPT_PATH}/after.manifest" > "${SCRIPT_PATH}/cache.manifest"
echo "[$(date)] јрхивирование различий ..."
mkdir -p "${CACHE_FOLDER}"
tar -cf "${CACHE_FOLDER}/cache.tar" --totals --files-from "${SCRIPT_PATH}/cache.manifest"
echo "[$(date)] √отово! $(du -h "${CACHE_FOLDER}/cache.tar")"
