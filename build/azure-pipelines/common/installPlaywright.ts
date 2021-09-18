/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
 *  Лицензировано в соответствии с лицензией MIT.
 *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

import { retry } from './retry';
const { installDefaultBrowsersForNpmInstall } = require('playwright/lib/utils/registry');

async function install() {
	await retry(() => installDefaultBrowsersForNpmInstall());
}

install();
