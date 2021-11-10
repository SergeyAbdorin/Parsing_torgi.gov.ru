Парсинг открытых данных с сайта https://torgi.gov.ru/index.html с помощью google script
=======================================================================================

Описание
--------
Стояла задача сделать это именно с помощью google script, с записью результатов в google sheet, где в дальнейшем уже формулами искали нужные записи.

Краткое описание по шагам
-------------------------
1. Получаем данные с сайта https://torgi.gov.ru/index.html в XML формате
2. т.к. полученные XML данные имеют кривой формат, то XMLService не может его распарсить
3. Преобразуем данные из XML в JSON
4. Собираем ссылки на извещения
5. Проходим по каждой ссылке, парсим с них данные по лотам и также преобразуем в JSON
6. Т.к. нас интересуют только торги по авто и недвижимости, с помощью регулярного выражения вытягиваем кадастровые номера и VIN.
7. Среди данных, которые мы получили, есть стартовая цена торгов. Она хранится с точкой, и чтобы google sheet смог распознать ее как сумму, заменяем точку на запятую.
8. Записываем данные в таблицу

Основной скрипт в полном объеме находится в файле parseOpenData.gs
В остальных файлах он же просто разбит на модули, для удобного переиспользования в других местах.
