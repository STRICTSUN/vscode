#!/usr/bin/env bash

# ���� ���� ������������� ������� ������� ��� ��������� ����� ������ ������ � "prepare.sh".
# ��� ������ ������� ������, ������� ��������������� ��������� �����, �� ������� ��� �� ����� ��������.

set -e

SCRIPT_PATH="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
SOURCE_FOLDER="${1:-"."}"

cd "${SOURCE_FOLDER}"
echo "[$(date)] �������� ��������� ""��""..."
find -L . -not -path "*/.git/*" -and -not -path "${SCRIPT_PATH}/*.manifest" -type f >  "${SCRIPT_PATH}/before.manifest"
echo "[$(date)] �������!"

