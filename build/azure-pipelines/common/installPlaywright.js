"use strict";
/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
 *  ������������� � ������������ � ��������� MIT.
 *  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const retry_1 = require("./retry");
const { installDefaultBrowsersForNpmInstall } = require('playwright/lib/utils/registry');
async function install() {
    await (0, retry_1.retry)(() => installDefaultBrowsersForNpmInstall());
}
install();
