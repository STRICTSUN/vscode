#!/bin/bash

# Этот файл просто обертывает команду docker build для создания образа, который включает файл cache.tar с результатом "prepare.sh" внутри него.
#Смотрите в cache.Dockerfile действия, которые фактически предпринимаются для этого.

set -e

SCRIPT_PATH="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
CONTAINER_IMAGE_REPOSITORY="$1"
BRANCH="${2:-"main"}"

if [ "${CONTAINER_IMAGE_REPOSITORY}" = "" ]; then
	echo "Хранилище контейнеров не указано!"
	exit 1
fi

TAG="branch-${BRANCH//\//-}"
echo "[$(date)] ${BRANCH} => ${TAG}"
cd "${SCRIPT_PATH}/../.."

echo "[$(date)] Запуск создания образа..."
docker build -t ${CONTAINER_IMAGE_REPOSITORY}:"${TAG}" -f "${SCRIPT_PATH}/cache.Dockerfile" .
echo "[$(date)] Image build complete."

echo "[$(date)] Проталкивание образа..."
docker push ${CONTAINER_IMAGE_REPOSITORY}:"${TAG}"
echo "[$(date)] Готово!"
