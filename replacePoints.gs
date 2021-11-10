function replacePoints() {
  //Начальную стоимость лота мы получаем в виде числа с точкой, поэтому заменяем точку на запятую, чтобы google sheet распознал ее как число.
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('source');
  var range = sheet.getRange("F7:F");
  range.setValues(range.getValues().map(function(row) {
    return [row[0].toString().replace(".", ",")];
  }));
  range = sheet.getRange("G7:G");
  range.setValues(range.getValues().map(function(row) {
    return [row[0].toString().replace(".", ",")];
  }));
}
