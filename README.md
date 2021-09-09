/*
 * 2021 © Перевод [АЕКовалёв](aek.ally@gmail.com)
 *             Без оборота на меня 
 */
# Студия Визуального Кода - С открытым исходным кодом "Code - OSS"
[![Feature Requests](https://img.shields.io/github/issues/microsoft/vscode/feature-request.svg)](https://github.com/microsoft/vscode/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc)
[![Bugs](https://img.shields.io/github/issues/microsoft/vscode/bug.svg)](https://github.com/microsoft/vscode/issues?utf8=✓&q=is%3Aissue+is%3Aopen+label%3Abug)
[![Gitter](https://img.shields.io/badge/chat-on%20gitter-yellow.svg)](https://gitter.im/Microsoft/vscode)

## Репозиторий

В этом репозитории ("`Code - OSS`") мы - Microsoft, разрабатываем продукт [Студия Визуального Кода](https://code.visualstudio.com) вместе с сообществом. Здесь мы не только работаем над кодом и проблемами, мы также публикуем нашу [дорожную карту](https://github.com/microsoft/vscode/wiki/Roadmap), [ежемесячные планы](https://github.com/microsoft/vscode/wiki/Iteration-Plans) и наши [планы на окончание](https://github.com/microsoft/vscode/wiki/Running-the-Endgame). Этот исходный код доступен каждому в соответствии со стандартной лицензией [MIT license](https://github.com/microsoft/vscode/blob/main/LICENSE.txt).

## Студия Визуального Кода

<p align="center">
  <img alt="VS Code in action" src="https://user-images.githubusercontent.com/35271042/118224532-3842c400-b438-11eb-923d-a5f66fa6785a.png">
</p>

[Студия Визуального Кода](https://code.visualstudio.com) представляет собой дистрибутив репозитория 'Code - OSS' с конкретными настройками Microsoft, выпущенный под традиционной [лицензией на продукт Microsoft](https://code.visualstudio.com/License/).

[Студия Визуального Кода](https://code.visualstudio.com) сочетает в себе простоту редактора кода с тем, что нужно разработчикам для их основного цикла редактирования-сборки-отладки. Она обеспечивает всестороннюю поддержку редактирования кода, навигации и понимания, а также легкую отладку, богатую модель расширяемости и легкую интеграцию с существующими инструментами.

Студия Визуального Кода ежемесячно обновляется новыми функциями и исправлениями ошибок. Вы можете скачать его для Windows, macOS и Linux на веб-сайте [Студия Визуального Кода](https://code.visualstudio.com/Download). Чтобы получать последние версии каждый день, установите сборку [Insiders](https://code.visualstudio.com/insiders).

## Содействие

Есть много способов принять участие в проекте, например:

* [Отправляйте сообщения об ошибках и запросы функций](https://github.com/microsoft/vscode/issues) и помогайте нам проверять, как они регистрируются.
* Просмотрите [Изменения исходного кода](https://github.com/microsoft/vscode/pulls)
* Просмотрите [Документацию](https://github.com/microsoft/vscode-docs) и делайте запросы на перенос для чего угодно, от опечаток до нового контента.

Если вы заинтересованы в устранении проблем и внесении непосредственного вклада в базу кода, смотрите документ [Как внести свой вклад](https://github.com/microsoft/vscode/wiki/How-to-Contribute), который охватывает следующее:

* [Как собрать и запустить из исходного кода](https://github.com/microsoft/vscode/wiki/How-to-Contribute)
* [Рабочий процесс разработки, включая отладку и запуск тестов](https://github.com/microsoft/vscode/wiki/How-to-Contribute#debugging)
* [Рекомендации по кодированию](https://github.com/microsoft/vscode/wiki/Coding-Guidelines)
* [Отправка запросов на перенос](https://github.com/microsoft/vscode/wiki/How-to-Contribute#pull-requests)
* [Поиск проблем по работе](https://github.com/microsoft/vscode/wiki/How-to-Contribute#where-to-contribute)
* [Содействие переводам](https://aka.ms/vscodeloc)

## Обратная связь

* Задайте вопрос на [Stack Overflow](https://stackoverflow.com/questions/tagged/vscode)
* [Запросите новую функцию](CONTRIBUTING.md)
* Голосуйте за [популярные запросы функций](https://github.com/microsoft/vscode/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request+sort%3Areactions-%2B1-desc)
* [Сообщите о проблеме](https://github.com/microsoft/vscode/issues)
* Следуйте [@code](https://twitter.com/code) и дайте нам знать, что вы думаете!

Смотрите наши [wiki](https://github.com/microsoft/vscode/wiki/Feedback-Channels) с описанием каждого из этих каналов и информацию о некоторых других доступных каналах сообщества.

## Связанные проекты

Многие из основных компонентов и расширений VS Code находятся в собственных репозиториях на GitHub. К примеру, [адаптер отладки узла](https://github.com/microsoft/vscode-node-debug) и [отладочный адаптер моно](https://github.com/microsoft/vscode-mono-debug) имеют свои собственные хранилища. Для получения полного списка, пожалуйста, посетите страницу [Связанные проекты](https://github.com/microsoft/vscode/wiki/Related-Projects) страницу на нашем [wiki](https://github.com/microsoft/vscode/wiki).

## Связанные расширения

Студия Визуального Кода содержит набор встроенных расширений, расположенных в папке [extensions](extensions) , включая грамматики и фрагменты для многих языков. Расширения, обеспечивающие богатую языковую поддержку - завершение кода, переход к определению, для языка имеют суффикс  `language-features`. Например, расширение `json` обеспечивает раскраску для `JSON` , а `json-language-features` обеспечивает богатую языковую поддержку для `JSON`.

## Контейнер для разработки

Этот репозиторий включает контейнер для удалённой разработки Студии Визуального Кода - Containers / GitHub Codespaces .

- Для [Контейнеры - Удалённо](https://aka.ms/vscode-remote/download/containers), используйте команду **Remote-Containers: Clone Repository in Container Volume...** которая создаёт том Docker для улучшения дискового ввода-вывода в macOS и Windows.
- Для Codespaces установите расширение [Github Codespaces](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) в Студии Визуального Кода и используйте команду **Codespaces: Create New Codespace** .

Docker/Codespace должен иметь как минимум **4 ядра и 6 ГБ ОЗУ - рекомендуется 8 ГБ** для запуска полной сборки. Смотрите [README контейнера разработки](.devcontainer/README.md) для получения дополнительной информации..

## Нормы поведения

В этом проекте принят [Кодекс поведения Microsoft для проектов с открытым исходным кодом](https://opensource.microsoft.com/codeofconduct/). Для получения дополнительной информации смотрите [Часто задаваемые вопросы о Кодексе поведения](https://opensource.microsoft.com/codeofconduct/faq/) или свяжитесь с [opencode@microsoft.com](mailto:opencode@microsoft.com) по любым дополнительным вопросам или комментариям.

## Лицензия

Copyright (c) Microsoft Corporation. All rights reserved.

Лицензировано в соответствии с лицензией [MIT](LICENSE.txt) license.
