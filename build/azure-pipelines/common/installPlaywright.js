"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
 *  Лицензировано в соответствии с лицензией MIT.
 *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const retry_1 = require("./retry");
const { installDefaultBrowsersForNpmInstall } = require('playwright/lib/utils/registry');
async function install() {
    await (0, retry_1.retry)(() => installDefaultBrowsersForNpmInstall());
}
install();
