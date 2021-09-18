/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as path from 'path';
import * as es from 'event-stream';
import * as Vinyl from 'vinyl';
import * as vfs from 'vinyl-fs';
import * as util from '../lib/util';
import * as filter from 'gulp-filter';
import * as gzip from 'gulp-gzip';
const azure = require('gulp-azure-storage');

const root = path.dirname(path.dirname(__dirname));
const commit = util.getVersion(root);

function main() {
	return vfs.src('**', { cwd: '../vscode-web', base: '../vscode-web', dot: true })
		.pipe(filter(f => !f.isDirectory()))
		.pipe(gzip({ append: false }))
		.pipe(es.through(function (data: Vinyl) {
			console.log('Загрузка файла CDN:', data.relative); //  Отладка.
			this.emit('data', data);
		}))
		.pipe(azure.upload({
			account: process.env.AZURE_STORAGE_ACCOUNT,
			key: process.env.AZURE_STORAGE_ACCESS_KEY,
			container: process.env.VSCODE_QUALITY,
			prefix: commit + '/',
			contentSettings: {
				contentEncoding: 'gzip',
				cacheControl: 'max-age=31536000, public'
			}
		}));
}

main();
