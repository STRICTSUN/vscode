/*---------------------------------------------------------------------------------------------
  * Авторское право (c) Корпорации Майкрософт. Все права защищены.
  * Лицензировано в соответствии с лицензией MIT.
  *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import * as path from 'path';
import * as cp from 'child_process';
import * as _ from 'underscore';
const parseSemver = require('parse-semver');

interface Tree {
	readonly name: string;
	readonly children?: Tree[];
}

interface FlatDependency {
	readonly name: string;
	readonly version: string;
	readonly path: string;
}

interface Dependency extends FlatDependency {
	readonly children: Dependency[];
}

function asYarnDependency(prefix: string, tree: Tree): Dependency | null {
	let parseResult;

	try {
		parseResult = parseSemver(tree.name);
	} catch (err) {
		err.message += `: ${tree.name}`;
		console.warn(`Не удалось проанализировать semver: ${tree.name}`);
		return null;
	}

	// Реальной зависимости на диске нет.
	if (parseResult.version !== parseResult.range) {
		return null;
	}

	const name = parseResult.name;
	const version = parseResult.version;
	const dependencyPath = path.join(prefix, name);
	const children = [];

	for (const child of (tree.children || [])) {
		const dep = asYarnDependency(path.join(prefix, name, 'node_modules'), child);

		if (dep) {
			children.push(dep);
		}
	}

	return { name, version, path: dependencyPath, children };
}

function getYarnProductionDependencies(cwd: string): Dependency[] {
	const raw = cp.execSync('yarn list --json', { cwd, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'production' }, stdio: [null, null, 'inherit'] });
	const match = /^{"type":"tree".*$/m.exec(raw);

	if (!match || match.length !== 1) {
		throw new Error('Не удалось проанализировать результат`yarn list --json.`');
	}

	const trees = JSON.parse(match[0]).data.trees as Tree[];

	return trees
		.map(tree => asYarnDependency(path.join(cwd, 'node_modules'), tree))
		.filter<Dependency>((dep): dep is Dependency => !!dep);
}

export function getProductionDependencies(cwd: string): FlatDependency[] {
	const result: FlatDependency[] = [];
	const deps = getYarnProductionDependencies(cwd);
	const flatten = (dep: Dependency) => { result.push({ name: dep.name, version: dep.version, path: dep.path }); dep.children.forEach(flatten); };
	deps.forEach(flatten);
	return _.uniq(result);
}

if (require.main === module) {
	const root = path.dirname(path.dirname(__dirname));
	console.log(JSON.stringify(getProductionDependencies(root), null, '  '));
}
