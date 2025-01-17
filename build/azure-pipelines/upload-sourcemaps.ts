/*---------------------------------------------------------------------------------------------
  *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as path from 'path';
import * as es from 'event-stream';
import * as Vinyl from 'vinyl';
import * as vfs from 'vinyl-fs';
import * as util from '../lib/util';
// @ts-ignore
import * as deps from '../lib/dependencies';
const azure = require('gulp-azure-storage');

const root = path.dirname(path.dirname(__dirname));
const commit = util.getVersion(root);

// ��� ������������� ��������� ����� �������� ����/���� ��� ��������.
const [, , base, maps] = process.argv;

function src(base: string, maps = `${base}/**/*.map`) {
	return vfs.src(maps, { base })
		.pipe(es.mapSync((f: Vinyl) => {
			f.path = `${f.base}/core/${f.relative}`;
			return f;
		}));
}

function main() {
	const sources = [];

	// ����� ������� vscode (�� ���������).
	if (!base) {
		const vs = src('out-vscode-min'); // ������ ���������� �������� �����.
		sources.push(vs);

		const productionDependencies: { name: string, path: string, version: string }[] = deps.getProductionDependencies(root);
		const productionDependenciesSrc = productionDependencies.map(d => path.relative(root, d.path)).map(d => `./${d}/**/*.map`);
		const nodeModules = vfs.src(productionDependenciesSrc, { base: '.' })
			.pipe(util.cleanNodeModules(path.join(root, 'build', '.moduleignore')));
		sources.push(nodeModules);

		const extensionsOut = vfs.src(['.build/extensions/**/*.js.map', '!**/node_modules/**'], { base: '.build' });
		sources.push(extensionsOut);
	}

	// ����/����� ����������� �������.
	else {
		sources.push(src(base, maps));
	}

	return es.merge(...sources)
		.pipe(es.through(function (data: Vinyl) {
			console.log('�������� �������� �����.', data.relative); // �������.
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
