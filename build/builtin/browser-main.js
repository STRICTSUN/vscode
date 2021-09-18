/*---------------------------------------------------------------------------------------------
 *  ��������� ����� (c) ���������� ����������. ��� ����� ��������.
* ������������� � ������������ � ��������� MIT.
*  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

const fs = require('fs');
const path = require('path');
const os = require('os');
const { ipcRenderer } = require('electron');

const builtInExtensionsPath = path.join(__dirname, '..', '..', 'product.json');
const controlFilePath = path.join(os.homedir(), '.vscode-oss-dev', 'extensions', 'control.json');

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }));
}

function writeJson(filePath, obj) {
	fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
}

function renderOption(form, id, title, value, checked) {
	const input = document.createElement('input');
	input.type = 'radio';
	input.id = id;
	input.name = 'choice';
	input.value = value;
	input.checked = !!checked;
	form.appendChild(input);

	const label = document.createElement('label');
	label.setAttribute('for', id);
	label.textContent = title;
	form.appendChild(label);

	return input;
}

function render(el, state) {
	function setState(state) {
		try {
			writeJson(controlFilePath, state.control);
		} catch (err) {
			console.error(err);
		}

		el.innerHTML = '';
		render(el, state);
	}

	const ul = document.createElement('ul');
	const { builtin, control } = state;

	for (const ext of builtin) {
		const controlState = control[ext.name] || 'marketplace';

		const li = document.createElement('li');
		ul.appendChild(li);

		const name = document.createElement('code');
		name.textContent = ext.name;
		li.appendChild(name);

		const form = document.createElement('form');
		li.appendChild(form);

		const marketplaceInput = renderOption(form, `marketplace-${ext.name}`, 'Marketplace', 'marketplace', controlState === 'marketplace');
		marketplaceInput.onchange = function () {
			control[ext.name] = 'marketplace';
			setState({ builtin, control });
		};

		const disabledInput = renderOption(form, `disabled-${ext.name}`, 'Disabled', 'disabled', controlState === 'disabled');
		disabledInput.onchange = function () {
			control[ext.name] = 'disabled';
			setState({ builtin, control });
		};

		let local = undefined;

		if (controlState !== 'marketplace' && controlState !== 'disabled') {
			local = controlState;
		}

		const localInput = renderOption(form, `local-${ext.name}`, 'Local', 'local', !!local);
		localInput.onchange = async function () {
			const result = await ipcRenderer.invoke('pickdir');

			if (result) {
				control[ext.name] = result;
				setState({ builtin, control });
			}
		};

		if (local) {
			const localSpan = document.createElement('code');
			localSpan.className = 'local';
			localSpan.textContent = local;
			form.appendChild(localSpan);
		}
	}

	el.appendChild(ul);
}

function main() {
	const el = document.getElementById('extensions');
	const builtin = readJson(builtInExtensionsPath).builtInExtensions;
	let control;

	try {
		control = readJson(controlFilePath);
	} catch (err) {
		control = {};
	}

	render(el, { builtin, control });
}

window.onload = main;
