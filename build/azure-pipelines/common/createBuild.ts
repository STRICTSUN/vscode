/*---------------------------------------------------------------------------------------------
 * ��������� ����� (c) ���������� ����������. ��� ����� ��������.
 *  ������������� � ������������ � ��������� MIT.
 *  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { CosmosClient } from '@azure/cosmos';
import { retry } from './retry';

if (process.argv.length !== 3) {
	console.error('������: node createBuild.js VERSION');
	process.exit(-1);
}

function getEnv(name: string): string {
	const result = process.env[name];

	if (typeof result === 'undefined') {
		throw new Error('����������� Env: ' + name);
	}

	return result;
}

async function main(): Promise<void> {
	const [, , _version] = process.argv;
	const quality = getEnv('VSCODE_QUALITY');
	const commit = getEnv('BUILD_SOURCEVERSION');
	const queuedBy = getEnv('BUILD_QUEUEDBY');
	const sourceBranch = getEnv('BUILD_SOURCEBRANCH');
	const version = _version + (quality === 'stable' ? '' : `-${quality}`);

	console.log('�������� ������ ...');
	console.log('��������:', quality);
	console.log('������:', version);
	console.log('������:', commit);

	const build = {
		id: commit,
		timestamp: (new Date()).getTime(),
		version,
		isReleased: false,
		sourceBranch,
		queuedBy,
		assets: [],
		updates: {}
	};

	const client = new CosmosClient({ endpoint: process.env['AZURE_DOCUMENTDB_ENDPOINT']!, key: process.env['AZURE_DOCUMENTDB_MASTERKEY'] });
	const scripts = client.database('builds').container(quality).scripts;
	await retry(() => scripts.storedProcedure('createBuild').execute('', [{ ...build, _partitionKey: '' }]));
}

main().then(() => {
	console.log('������ ������� �������.');
	process.exit(0);
}, err => {
	console.error(err);
	process.exit(1);
});
