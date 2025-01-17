"use strict";
/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
* Лицензировано в соответствии с лицензией MIT.
*  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const i18n = require("../i18n");
suite('Тесты анализатора XLF', () => {
    const sampleXlf = '<?xml version="1.0" encoding="utf-8"?><xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2"><file original="vs/base/common/keybinding" source-language="en" datatype="plaintext"><body><trans-unit id="key1"><source xml:lang="en">Key #1</source></trans-unit><trans-unit id="key2"><source xml:lang="en">Key #2 &amp;</source></trans-unit></body></file></xliff>';
    const sampleTranslatedXlf = '<?xml version="1.0" encoding="utf-8"?><xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2"><file original="vs/base/common/keybinding" source-language="en" target-language="ru" datatype="plaintext"><body><trans-unit id="key1"><source xml:lang="en">Key #1</source><target>Кнопка #1</target></trans-unit><trans-unit id="key2"><source xml:lang="en">Key #2 &amp;</source><target>Кнопка #2 &amp;</target></trans-unit></body></file></xliff>';
    const originalFilePath = 'vs/base/common/keybinding';
    const keys = ['key1', 'key2'];
    const messages = ['Key #1', 'Key #2 &'];
    const translatedMessages = { key1: 'Кнопка #1', key2: 'Кнопка #2 &' };
	test('Преобразование кнопок и сообщений в XLF.', () => {
        const xlf = new i18n.XLF('vscode-workbench');
        xlf.addFile(originalFilePath, keys, messages);
        const xlfString = xlf.toString();
        assert.strictEqual(xlfString.replace(/\s{2,}/g, ''), sampleXlf);
    });
	test('Преобразование XLF в кнопки и сообщения.', () => {
        i18n.XLF.parse(sampleTranslatedXlf).then(function (resolvedFiles) {
            assert.deepStrictEqual(resolvedFiles[0].messages, translatedMessages);
            assert.strictEqual(resolvedFiles[0].originalFilePath, originalFilePath);
        });
    });
	test('Исходный путь файла JSON к ресурсу Transifex совпадает.', () => {
        const editorProject = 'vscode-editor', workbenchProject = 'vscode-workbench';
        const platform = { name: 'vs/platform', project: editorProject }, editorContrib = { name: 'vs/editor/contrib', project: editorProject }, editor = { name: 'vs/editor', project: editorProject }, base = { name: 'vs/base', project: editorProject }, code = { name: 'vs/code', project: workbenchProject }, workbenchParts = { name: 'vs/workbench/contrib/html', project: workbenchProject }, workbenchServices = { name: 'vs/workbench/services/textfile', project: workbenchProject }, workbench = { name: 'vs/workbench', project: workbenchProject };
        assert.deepStrictEqual(i18n.getResource('vs/platform/actions/browser/menusExtensionPoint'), platform);
        assert.deepStrictEqual(i18n.getResource('vs/editor/contrib/clipboard/browser/clipboard'), editorContrib);
        assert.deepStrictEqual(i18n.getResource('vs/editor/common/modes/modesRegistry'), editor);
        assert.deepStrictEqual(i18n.getResource('vs/base/common/errorMessage'), base);
        assert.deepStrictEqual(i18n.getResource('vs/code/electron-main/window'), code);
        assert.deepStrictEqual(i18n.getResource('vs/workbench/contrib/html/browser/webview'), workbenchParts);
        assert.deepStrictEqual(i18n.getResource('vs/workbench/services/textfile/node/testFileService'), workbenchServices);
        assert.deepStrictEqual(i18n.getResource('vs/workbench/browser/parts/panel/panelActions'), workbench);
    });
});
