/*---------------------------------------------------------------------------------------------
  *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const es = require("event-stream");
const vfs = require("vinyl-fs");
const util = require("../lib/util");
// @ts-ignore
const deps = require("../lib/dependencies");
const azure = require('gulp-azure-storage');
const root = path.dirname(path.dirname(__dirname));
const commit = util.getVersion(root);
// При необходимости разрешить явную передачу базы/карт для загрузки.
const [, , base, maps] = process.argv;
function src(base, maps = `${base}/**/*.map`) {
    return vfs.src(maps, { base })
        .pipe(es.mapSync((f) => {
        f.path = `${f.base}/core/${f.relative}`;
        return f;
    }));
}
function main() {
    const sources = [];
    // Карты клиента vscode (по умолчанию).
    if (!base) {
		const vs = src('out-vscode-min'); // Только клиентские исходные карты.
        sources.push(vs);
        const productionDependencies = deps.getProductionDependencies(root);
        const productionDependenciesSrc = productionDependencies.map(d => path.relative(root, d.path)).map(d => `./${d}/**/*.map`);
        const nodeModules = vfs.src(productionDependenciesSrc, { base: '.' })
            .pipe(util.cleanNodeModules(path.join(root, 'build', '.moduleignore')));
        sources.push(nodeModules);
        const extensionsOut = vfs.src(['.build/extensions/**/*.js.map', '!**/node_modules/**'], { base: '.build' });
        sources.push(extensionsOut);
    }
    // база/карты конкретного клиента.
    else {
        sources.push(src(base, maps));
    }
    return es.merge(...sources)
        .pipe(es.through(function (data) {
			console.log('Загрузка исходной карты.', data.relative); // Отладка.
        this.emit('data', data);
    }))
        .pipe(azure.upload({
        account: process.env.AZURE_STORAGE_ACCOUNT,
        key: process.env.AZURE_STORAGE_ACCESS_KEY,
        container: 'sourcemaps',
        prefix: commit + '/'
    }));
}
main();
