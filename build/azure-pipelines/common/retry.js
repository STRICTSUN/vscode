/*---------------------------------------------------------------------------------------------
 * Авторское право (c) Корпорации Майкрософт. Все права защищены.
 *  Лицензировано в соответствии с лицензией MIT.
 *  Информацию о лицензии смотрите в License.txt, в корневом каталоге проекта.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
async function retry(fn) {
    for (let run = 1; run <= 10; run++) {
        try {
            return await fn();
        }
        catch (err) {
            if (!/ECONNRESET/.test(err.message)) {
                throw err;
            }
            const millis = (Math.random() * 200) + (50 * Math.pow(1.5, run));
			console.log(`Ошибка ECONNRESET, повторная попытка через ${millis} мс ...`);
            // Максимальная задержка при 10-й повторной попытке: ~3 секунды.
            await new Promise(c => setTimeout(c, millis));
        }
    }
    throw new Error('Слишком много повторных попыток.');
}
exports.retry = retry;
