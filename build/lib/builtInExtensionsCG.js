"use strict";
/*---------------------------------------------------------------------------------------------
  *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
  * Лицензировано в соответствии с лицензией MIT.
  *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const got_1 = require("got");
const fs = require("fs");
const path = require("path");
const url = require("url");
const ansiColors = require("ansi-colors");
const root = path.dirname(path.dirname(__dirname));
const rootCG = path.join(root, 'extensionsCG');
const productjson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../product.json'), 'utf8'));
const builtInExtensions = productjson.builtInExtensions || [];
const webBuiltInExtensions = productjson.webBuiltInExtensions || [];
const token = process.env['VSCODE_MIXIN_PASSWORD'] || process.env['GITHUB_TOKEN'] || undefined;
const contentBasePath = 'raw.githubusercontent.com';
const contentFileNames = ['package.json', 'package-lock.json', 'yarn.lock'];
async function downloadExtensionDetails(extension) {
    var _a, _b, _c;
    const extensionLabel = `${extension.name}@${extension.version}`;
    const repository = url.parse(extension.repo).path.substr(1);
    const repositoryContentBaseUrl = `https://${token ? `${token}@` : ''}${contentBasePath}/${repository}/v${extension.version}`;
    const promises = [];
    for (const fileName of contentFileNames) {
        promises.push(new Promise(resolve => {
            (0, got_1.default)(`${repositoryContentBaseUrl}/${fileName}`)
                .then(response => {
                resolve({ fileName, body: response.rawBody });
            })
                .catch(error => {
                if (error.response.statusCode === 404) {
                    resolve({ fileName, body: undefined });
                }
                else {
                    resolve({ fileName, body: null });
                }
            });
        }));
    }
    console.log(extensionLabel);
    const results = await Promise.all(promises);
    for (const result of results) {
        if (result.body) {
            const extensionFolder = path.join(rootCG, extension.name);
            fs.mkdirSync(extensionFolder, { recursive: true });
            fs.writeFileSync(path.join(extensionFolder, result.fileName), result.body);
            console.log(`  - ${result.fileName} ${ansiColors.green('✔︎')}`);
        }
        else if (result.body === undefined) {
            console.log(`  - ${result.fileName} ${ansiColors.yellow('⚠️')}`);
        }
        else {
            console.log(`  - ${result.fileName} ${ansiColors.red('🛑')}`);
        }
    }
    // Validation
    if (!((_a = results.find(r => r.fileName === 'package.json')) === null || _a === void 0 ? void 0 : _a.body)) {
        // throw new Error(`Не удалось найти файл package.json для встроенного расширения - ${extensionLabel}`);
    }
    if (!((_b = results.find(r => r.fileName === 'package-lock.json')) === null || _b === void 0 ? void 0 : _b.body) &&
        !((_c = results.find(r => r.fileName === 'yarn.lock')) === null || _c === void 0 ? void 0 : _c.body)) {
        // throw new Error(`Не удалось найти package-lock.json/yarn.lock для встроенного расширения - ${extensionLabel}`);
    }
}
async function main() {
    for (const extension of [...builtInExtensions, ...webBuiltInExtensions]) {
        await downloadExtensionDetails(extension);
    }
}
main().then(() => {
	console.log(`Загружены данные компонентов встроенных расширений ${ansiColors.green('✔︎')}`);
    process.exit(0);
}, err => {
	console.log(`Не удалось загрузить данные компонентов встроенных расширений ${ansiColors.red('🛑')}`);
    console.error(err);
    process.exit(1);
});
