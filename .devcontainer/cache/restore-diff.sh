#!/usr/bin/env bash

# ���� ���� ��������� ���� cache.tar � ������, ������� �������� ���������� "prepare.sh" ������ ��������� ������.
#  �� ����������� ��� ������� postCreateCommand, ������� ����������� ����� ����, ��� ���������/������� ������������ ��� ��������, ��� �� ������ ���������� ������� ���� "yarn install".

set -e

SOURCE_FOLDER="$(cd "${1:-"."}" && pwd)"
CACHE_FOLDER="${2:-"/usr/local/etc/devcontainer-cache"}"

if [ ! -d "${CACHE_FOLDER}" ]; then
	echo "�� ������� ����� ����."
	exit 0
fi

echo "[$(date)] Expanding $(du -h "${CACHE_FOLDER}/cache.tar") file to ${SOURCE_FOLDER}..."
cd "${SOURCE_FOLDER}"
tar -xf "${CACHE_FOLDER}/cache.tar"
rm -f "${CACHE_FOLDER}/cache.tar"
echo "[$(date)] ������!"

