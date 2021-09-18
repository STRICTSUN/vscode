/*---------------------------------------------------------------------------------------------
 * ��������� ����� (c) ���������� ����������. ��� ����� ��������.
 *  ������������� � ������������ � ��������� MIT.
 *  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/

'use strict';
export async function retry<T>(fn: () => Promise<T>): Promise<T> {
	for (let run = 1; run <= 10; run++) {
		try {
			return await fn();
		} catch (err) {
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
