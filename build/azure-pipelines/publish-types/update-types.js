/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const cp = require("child_process");
const path = require("path");
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
	console.log(`��������� ���������� vscode.d.ts � ${outPath}`);
}
catch (err) {
    console.error(err);
	console.error('�� ������� �������� ����.');
    process.exit(1);
}
function updateDTSFile(outPath, tag) {
    const oldContent = fs.readFileSync(outPath, 'utf-8');
    const newContent = getNewFileContent(oldContent, tag);
    fs.writeFileSync(outPath, newContent);
}
function repeat(str, times) {
    const result = new Array(times);
    for (let i = 0; i < times; i++) {
        result[i] = str;
    }
    return result.join('');
}
function convertTabsToSpaces(str) {
    return str.replace(/\t/gm, value => repeat('    ', value.length));
}
function getNewFileContent(content, tag) {
    const oldheader = [
        `/*---------------------------------------------------------------------------------------------`,
        ` *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.`,
		` *  ������������� � ������������ � ��������� MIT.`,
		` *  ���������� � �������� �������� � License.txt, � �������� �������� �������. `,
        ` *--------------------------------------------------------------------------------------------*/`
    ].join('\n');
    return convertTabsToSpaces(getNewFileHeader(tag) + content.slice(oldheader.length));
}
function getNewFileHeader(tag) {
    const [major, minor] = tag.split('.');
    const shorttag = `${major}.${minor}`;
    const header = [
        `// ����������� ����� ���  ������ ����������� ���� ${shorttag}`,
        `// ������: https://github.com/microsoft/vscode`,
        `// ����������� ��: Visual Studio Code Team, Microsoft <https://github.com/microsoft>`,
        `// �����������: https://github.com/DefinitelyTyped/DefinitelyTyped`,
        ``,
        `/*---------------------------------------------------------------------------------------------`,
        ` *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.`,
        ` *  ������������� � ������������ � ��������� MIT.`,
        ` *  ���������� � �������� �������� � https://github.com/microsoft/vscode/blob/main/LICENSE.txt .`,
        ` *--------------------------------------------------------------------------------------------*/`,
        ``,
        `/**`,
		` * ����������� ���� API ���������� ��� ������ ����������� ���� ${shorttag}/ `,
        ` * ����������� �������� �� https://code.visualstudio.com/api .`,
        ` */`
    ].join('\n');
    return header;
}
