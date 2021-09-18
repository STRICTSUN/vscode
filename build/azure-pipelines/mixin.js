/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const json = require("gulp-json-editor");
const buffer = require('gulp-buffer');
const filter = require("gulp-filter");
const es = require("event-stream");
const vfs = require("vinyl-fs");
const fancyLog = require("fancy-log");
const ansiColors = require("ansi-colors");
const fs = require("fs");
const path = require("path");
function main() {
    const quality = process.env['VSCODE_QUALITY'];
    if (!quality) {
		console.log('Отсутствует VSCODE_QUALITY, смешивание пропущено.');
        return;
    }
    const productJsonFilter = filter(f => f.relative === 'product.json', { restore: true });
	fancyLog(ansiColors.blue('[mixin]'), `Смешивание в исходниках:`);
    return vfs
        .src(`quality/${quality}/**`, { base: `quality/${quality}` })
        .pipe(filter(f => !f.isDirectory()))
        .pipe(productJsonFilter)
        .pipe(buffer())
        .pipe(json((o) => {
        const ossProduct = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'product.json'), 'utf8'));
        let builtInExtensions = ossProduct.builtInExtensions;
        if (Array.isArray(o.builtInExtensions)) {
			fancyLog(ansiColors.blue('[mixin]'), 'Перезапись встроенных расширений:', o.builtInExtensions.map(e => e.name));
            builtInExtensions = o.builtInExtensions;
        }
        else if (o.builtInExtensions) {
            const include = o.builtInExtensions['include'] || [];
            const exclude = o.builtInExtensions['exclude'] || [];
			fancyLog(ansiColors.blue('[mixin]'), 'Встроенные расширения OSS:', builtInExtensions.map(e => e.name));
			fancyLog(ansiColors.blue('[mixin]'), 'Включая встроенные расширения:', include.map(e => e.name));
			fancyLog(ansiColors.blue('[mixin]'), 'Исключая встроенные расширения:', exclude);
            builtInExtensions = builtInExtensions.filter(ext => !include.find(e => e.name === ext.name) && !exclude.find(name => name === ext.name));
            builtInExtensions = [...builtInExtensions, ...include];
			fancyLog(ansiColors.blue('[mixin]'), 'Окончательные встроенные расширения:', builtInExtensions.map(e => e.name));
        }
        else {
			fancyLog(ansiColors.blue('[mixin]'), 'Наследование встроенных расширений OSS.', builtInExtensions.map(e => e.name));
        }
        return Object.assign(Object.assign({ webBuiltInExtensions: ossProduct.webBuiltInExtensions }, o), { builtInExtensions });
    }))
        .pipe(productJsonFilter.restore)
        .pipe(es.mapSync(function (f) {
        fancyLog(ansiColors.blue('[mixin]'), f.relative, ansiColors.green('✔︎'));
        return f;
    }))
        .pipe(vfs.dest('.'));
}
main();
