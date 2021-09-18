/*---------------------------------------------------------------------------------------------
 * ��������� ����� (c) ���������� ����������. ��� ����� ��������.
 *  ������������� � ������������ � ��������� MIT.
 *  ���������� � �������� �������� � License.txt, � �������� �������� �������.
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
			console.log(`������ ECONNRESET, ��������� ������� ����� ${millis} �� ...`);
            // ������������ �������� ��� 10-� ��������� �������: ~3 �������.
            await new Promise(c => setTimeout(c, millis));
        }
    }
    throw new Error('������� ����� ��������� �������.');
}
exports.retry = retry;
