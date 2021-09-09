#!/usr/bin/env bash

# Этот файл устанавливает базовый уровень для хранилища перед любыми шагами в "prepare.sh".
# Это просто команда поиска, которая отфильтровывает несколько вещей, на которые нам не нужно смотреть.

set -e

SCRIPT_PATH="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
SOURCE_FOLDER="${1:-"."}"

cd "${SOURCE_FOLDER}"
echo "[$(date)] Создание манифеста ""до""..."
find -L . -not -path "*/.git/*" -and -not -path "${SCRIPT_PATH}/*.manifest" -type f >  "${SCRIPT_PATH}/before.manifest"
echo "[$(date)] Сделано!"

