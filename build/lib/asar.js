/*---------------------------------------------------------------------------------------------
 *  Авторское право (c) Корпорации Майкрософт. Все права защищены.
 * Лицензировано в соответствии с лицензией MIT.
 *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAsar = void 0;
const path = require("path");
const es = require("event-stream");
const pickle = require('chromium-pickle-js');
const Filesystem = require('asar/lib/filesystem');
const VinylFile = require("vinyl");
const minimatch = require("minimatch");
function createAsar(folderPath, unpackGlobs, destFilename) {
    const shouldUnpackFile = (file) => {
        for (let i = 0; i < unpackGlobs.length; i++) {
            if (minimatch(file.relative, unpackGlobs[i])) {
                return true;
            }
        }
        return false;
    };
    const filesystem = new Filesystem(folderPath);
    const out = [];
    // Слежение за незавершенными вставками.
    let pendingInserts = 0;
    let onFileInserted = () => { pendingInserts--; };
    // Не вставлять дважды, один и тот же каталог.
    const seenDir = {};
    const insertDirectoryRecursive = (dir) => {
        if (seenDir[dir]) {
            return;
        }
        let lastSlash = dir.lastIndexOf('/');
        if (lastSlash === -1) {
            lastSlash = dir.lastIndexOf('\\');
        }
        if (lastSlash !== -1) {
            insertDirectoryRecursive(dir.substring(0, lastSlash));
        }
        seenDir[dir] = true;
        filesystem.insertDirectory(dir);
    };
    const insertDirectoryForFile = (file) => {
        let lastSlash = file.lastIndexOf('/');
        if (lastSlash === -1) {
            lastSlash = file.lastIndexOf('\\');
        }
        if (lastSlash !== -1) {
            insertDirectoryRecursive(file.substring(0, lastSlash));
        }
    };
    const insertFile = (relativePath, stat, shouldUnpack) => {
        insertDirectoryForFile(relativePath);
        pendingInserts++;
        // Не передавать onFileInserted напрямую, потому что он будет перезаписан ниже.
        // Сделать запись закрытия "onFileInserted".
        filesystem.insertFile(relativePath, shouldUnpack, { stat: stat }, {}).then(() => onFileInserted(), () => onFileInserted());
    };
    return es.through(function (file) {
        if (file.stat.isDirectory()) {
            return;
        }
        if (!file.stat.isFile()) {
			throw new Error(`неизвестный объект в потоке!`);
        }
        const shouldUnpack = shouldUnpackFile(file);
        insertFile(file.relative, { size: file.contents.length, mode: file.stat.mode }, shouldUnpack);
        if (shouldUnpack) {
            // Файл находится вне xx.asar, в папке xx.asar.unpacked.
            const relative = path.relative(folderPath, file.path);
            this.queue(new VinylFile({
                base: '.',
                path: path.join(destFilename + '.unpacked', relative),
                stat: file.stat,
                contents: file.contents
            }));
        }
        else {
            // Файл находится внутри xx.asar.
            out.push(file.contents);
        }
    }, function () {
        let finish = () => {
            {
                const headerPickle = pickle.createEmpty();
                headerPickle.writeString(JSON.stringify(filesystem.header));
                const headerBuf = headerPickle.toBuffer();
                const sizePickle = pickle.createEmpty();
                sizePickle.writeUInt32(headerBuf.length);
                const sizeBuf = sizePickle.toBuffer();
                out.unshift(headerBuf);
                out.unshift(sizeBuf);
            }
            const contents = Buffer.concat(out);
            out.length = 0;
            this.queue(new VinylFile({
                base: '.',
                path: destFilename,
                contents: contents
            }));
            this.queue(null);
        };
        // Метод finish() вызывается, только после завершения вставки всех файлов ... .
        if (pendingInserts === 0) {
            finish();
        }
        else {
            onFileInserted = () => {
                pendingInserts--;
                if (pendingInserts === 0) {
                    finish();
                }
            };
        }
    });
}
exports.createAsar = createAsar;
