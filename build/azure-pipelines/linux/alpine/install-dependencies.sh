#!/usr/bin/env bash
set -e

echo "Установка удалённых зависимостей."
(cd remote && rm -rf node_modules && yarn)