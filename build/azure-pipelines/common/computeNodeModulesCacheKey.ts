/*---------------------------------------------------------------------------------------------
 * ��������� ����� (c) ���������� ����������. ��� ����� ��������.
 *  ������������� � ������������ � ��������� MIT. 
 *  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
const { dirs } = require('../../npm/dirs');

const ROOT = path.join(__dirname, '../../../');

const shasum = crypto.createHash('sha1');

shasum.update(fs.readFileSync(path.join(ROOT, 'build/.cachesalt')));
shasum.update(fs.readFileSync(path.join(ROOT, '.yarnrc')));
shasum.update(fs.readFileSync(path.join(ROOT, 'remote/.yarnrc')));

// ���������� ����� package.json � yarn.lock .
for (let dir of dirs) {
	const packageJsonPath = path.join(ROOT, dir, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
	const relevantPackageJsonSections = {
		dependencies: packageJson.dependencies,
		devDependencies: packageJson.devDependencies,
		optionalDependencies: packageJson.optionalDependencies,
		resolutions: packageJson.resolutions
	};
	shasum.update(JSON.stringify(relevantPackageJsonSections));

	const yarnLockPath = path.join(ROOT, dir, 'yarn.lock');
	shasum.update(fs.readFileSync(yarnLockPath));
}

// ���������� ����� ������ ���������� ��������� ������
for (let i = 2; i < process.argv.length; i++) {
	shasum.update(process.argv[i]);
}

process.stdout.write(shasum.digest('hex'));
