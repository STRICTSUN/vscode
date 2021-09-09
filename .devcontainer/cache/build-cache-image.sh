#!/bin/bash

# ���� ���� ������ ���������� ������� docker build ��� �������� ������, ������� �������� ���� cache.tar � ����������� "prepare.sh" ������ ����.
#�������� � cache.Dockerfile ��������, ������� ���������� ��������������� ��� �����.

set -e

SCRIPT_PATH="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
CONTAINER_IMAGE_REPOSITORY="$1"
BRANCH="${2:-"main"}"

if [ "${CONTAINER_IMAGE_REPOSITORY}" = "" ]; then
	echo "��������� ����������� �� �������!"
	exit 1
fi

TAG="branch-${BRANCH//\//-}"
echo "[$(date)] ${BRANCH} => ${TAG}"
cd "${SCRIPT_PATH}/../.."

echo "[$(date)] ������ �������� ������..."
docker build -t ${CONTAINER_IMAGE_REPOSITORY}:"${TAG}" -f "${SCRIPT_PATH}/cache.Dockerfile" .
echo "[$(date)] Image build complete."

echo "[$(date)] ������������� ������..."
docker push ${CONTAINER_IMAGE_REPOSITORY}:"${TAG}"
echo "[$(date)] ������!"
