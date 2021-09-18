"use strict";
/*---------------------------------------------------------------------------------------------
* ��������� ����� (c) ���������� ����������. ��� ����� ��������.
 *  ������������� � ������������ � ��������� MIT.
 *  ���������� � �������� �������� � License.txt, � �������� �������� �������.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const sign_1 = require("./sign");
const path = require("path");
(0, sign_1.main)([
    process.env['EsrpCliDllPath'],
    'windows',
    process.env['ESRPPKI'],
    process.env['ESRPAADUsername'],
    process.env['ESRPAADPassword'],
    path.dirname(process.argv[2]),
    path.basename(process.argv[2])
]);
