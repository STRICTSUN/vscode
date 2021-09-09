#!/usr/bin/env bash

# ���� ���� ������������ ��� ������������� ����� ���� �������� � �������� ������, � ������ ����� ������.
# ��� ������ ������� ������������ / ��������� ����� ��������, ��� ����� ������������� � ���������� �����.

set -e

SCRIPT_PATH="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
SOURCE_FOLDER="${1:-"."}"
CACHE_FOLDER="${2:-"/usr/local/etc/devcontainer-cache"}"

echo "[$(date)] ������ �������� � ����� ..."
cd "${SOURCE_FOLDER}"
echo "[$(date)] ����������� �������� ..."
find -L . -not -path "*/.git/*" -and -not -path "${SCRIPT_PATH}/*.manifest" -type f > "${SCRIPT_PATH}/after.manifest"
grep -Fxvf  "${SCRIPT_PATH}/before.manifest" "${SCRIPT_PATH}/after.manifest" > "${SCRIPT_PATH}/cache.manifest"
echo "[$(date)] ������������� �������� ..."
mkdir -p "${CACHE_FOLDER}"
tar -cf "${CACHE_FOLDER}/cache.tar" --totals --files-from "${SCRIPT_PATH}/cache.manifest"
echo "[$(date)] ������! $(du -h "${CACHE_FOLDER}/cache.tar")"
