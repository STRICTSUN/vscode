/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const cp = require("child_process");
let tag = '';
try {
    tag = cp
        .execSync('git describe --tags `git rev-list --tags --max-count=1`')
        .toString()
        .trim();
    if (!isValidTag(tag)) {
		throw Error(`������������ ��� ${tag}`);
    }
}
catch (err) {
    console.error(err);
	console.error('�� ������� �������� ����.');
    process.exit(1);
}
function isValidTag(t) {
    if (t.split('.').length !== 3) {
        return false;
    }
    const [major, minor, bug] = t.split('.');
    // ������ ������ ��� ����� �����, ��� 1.34.0.
    if (bug !== '0') {
        return false;
    }
    if (isNaN(parseInt(major, 10)) || isNaN(parseInt(minor, 10))) {
        return false;
    }
    return true;
}
