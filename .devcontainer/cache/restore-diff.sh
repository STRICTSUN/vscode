#!/usr/bin/env bash

# Этот файл расширяет файл cache.tar в образе, который содержит результаты "prepare.sh" поверх исходного дерева.
#  Он запускается как команда postCreateCommand, которая выполняется после того, как контейнер/кодовое пространство уже запущено, где вы обычно выполняете команду типа "yarn install".

set -e

SOURCE_FOLDER="$(cd "${1:-"."}" && pwd)"
CACHE_FOLDER="${2:-"/usr/local/etc/devcontainer-cache"}"

if [ ! -d "${CACHE_FOLDER}" ]; then
	echo "Не найдена папка кэша."
	exit 0
fi

echo "[$(date)] Expanding $(du -h "${CACHE_FOLDER}/cache.tar") file to ${SOURCE_FOLDER}..."
cd "${SOURCE_FOLDER}"
tar -xf "${CACHE_FOLDER}/cache.tar"
rm -f "${CACHE_FOLDER}/cache.tar"
echo "[$(date)] Готово!"

