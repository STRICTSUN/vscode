/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as fs from 'fs';
import * as cp from 'child_process';
import * as path from 'path';

let tag = '';
try {
	tag = cp
		.execSync('git describe --tags `git rev-list --tags --max-count=1`')
		.toString()
		.trim();

	const dtsUri = `https://raw.githubusercontent.com/microsoft/vscode/${tag}/src/vs/vscode.d.ts`;
	const outPath = path.resolve(process.cwd(), 'DefinitelyTyped/types/vscode/index.d.ts');
	cp.execSync(`curl ${dtsUri} --output ${outPath}`);

	updateDTSFile(outPath, tag);

	console.log(`Выполнено обновление vscode.d.ts в ${outPath}`);
} catch (err) {
	console.error(err);
	console.error('Не удалось обновить типы.');
	process.exit(1);
}

function updateDTSFile(outPath: string, tag: string) {
	const oldContent = fs.readFileSync(outPath, 'utf-8');
	const newContent = getNewFileContent(oldContent, tag);

	fs.writeFileSync(outPath, newContent);
}

function repeat(str: string, times: number): string {
	const result = new Array(times);
	for (let i = 0; i < times; i++) {
		result[i] = str;
	}
	return result.join('');
}

function convertTabsToSpaces(str: string): string {
	return str.replace(/\t/gm, value => repeat('    ', value.length));
}

function getNewFileContent(content: string, tag: string) {
	const oldheader = [
		`/*---------------------------------------------------------------------------------------------`,
		` *  Авторское право (c) Корпорации Майкрософт. Все права защищены.`,
		` *  Лицензировано в соответствии с лицензией MIT.`,
		` *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта. `,
		` *--------------------------------------------------------------------------------------------*/`
	].join('\n');

	return convertTabsToSpaces(getNewFileHeader(tag) + content.slice(oldheader.length));
}

function getNewFileHeader(tag: string) {
	const [major, minor] = tag.split('.');
	const shorttag = `${major}.${minor}`;

	const header = [
		`// Определения типов для  Студии Визуального Кода ${shorttag}`,
		`// Проект: https://github.com/microsoft/vscode`,
		`// Определения по: Visual Studio Code Team, Microsoft <https://github.com/microsoft>`,
		`// Определения: https://github.com/DefinitelyTyped/DefinitelyTyped`,
		``,
		`/*---------------------------------------------------------------------------------------------`,
		` *  Авторское право (c) Корпорации Майкрософт. Все права защищены.`,
		` *  Лицензировано в соответствии с лицензией MIT.`,
		` *  Информацию о лицензии смотрите в https://github.com/microsoft/vscode/blob/main/LICENSE.txt .`,
		` *--------------------------------------------------------------------------------------------*/`,
		``,
		`/**`,
		` * Определение типа API расширения для Студии Визуального Кода ${shorttag}/ `,
		` * Подробности смотрите на https://code.visualstudio.com/api .`,
		` */`
	].join('\n');

	return header;
}
