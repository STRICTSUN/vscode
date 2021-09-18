/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { makeUniversalApp } from 'vscode-universal-bundler';
import { spawn } from '@malept/cross-spawn-promise';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as plist from 'plist';
import * as product from '../../product.json';

async function main() {
	const buildDir = process.env['AGENT_BUILDDIRECTORY'];
	const arch = process.env['VSCODE_ARCH'];

	if (!buildDir) {
		throw new Error('$AGENT_BUILDDIRECTORY not set');
	}

	const appName = product.nameLong + '.app';
	const x64AppPath = path.join(buildDir, 'VSCode-darwin-x64', appName);
	const arm64AppPath = path.join(buildDir, 'VSCode-darwin-arm64', appName);
	const x64AsarPath = path.join(x64AppPath, 'Contents', 'Resources', 'app', 'node_modules.asar');
	const arm64AsarPath = path.join(arm64AppPath, 'Contents', 'Resources', 'app', 'node_modules.asar');
	const outAppPath = path.join(buildDir, `VSCode-darwin-${arch}`, appName);
	const productJsonPath = path.resolve(outAppPath, 'Contents', 'Resources', 'app', 'product.json');
	const infoPlistPath = path.resolve(outAppPath, 'Contents', 'Info.plist');

	await makeUniversalApp({
		x64AppPath,
		arm64AppPath,
		x64AsarPath,
		arm64AsarPath,
		filesToSkip: [
			'product.json',
			'Credits.rtf',
			'CodeResources',
			'fsevents.node',
			'Info.plist', // TODO@deepak1556:регрессия с 11.4.2 внутренней сборки.
			'.npmrc'
		],
		outAppPath,
		force: true
	});

	let productJson = await fs.readJson(productJsonPath);
	Object.assign(productJson, {
		darwinUniversalAssetId: 'darwin-universal'
	});
	await fs.writeJson(productJsonPath, productJson);

	let infoPlistString = await fs.readFile(infoPlistPath, 'utf8');
	let infoPlistJson = plist.parse(infoPlistString);
	Object.assign(infoPlistJson, {
		LSRequiresNativeExecution: true
	});
	await fs.writeFile(infoPlistPath, plist.build(infoPlistJson), 'utf8');

	// Проверка правильности архитектуры собственного модуля.
	const findOutput = await spawn('find', [outAppPath, '-name', 'keytar.node'])
	const lipoOutput = await spawn('lipo', ['-archs', findOutput.replace(/\n$/, "")]);
	if (lipoOutput.replace(/\n$/, "") !== 'x86_64 arm64') {
		throw new Error(`Некорректный архив, получено : ${lipoOutput}`)
	}
}

if (require.main === module) {
	main().catch(err => {
		console.error(err);
		process.exit(1);
	});
}
