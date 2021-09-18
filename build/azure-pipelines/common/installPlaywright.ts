/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
 *  ������������� � ������������ � ��������� MIT.
 *  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

import { retry } from './retry';
const { installDefaultBrowsersForNpmInstall } = require('playwright/lib/utils/registry');

async function install() {
	await retry(() => installDefaultBrowsersForNpmInstall());
}

install();
