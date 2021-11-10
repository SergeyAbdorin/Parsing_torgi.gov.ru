function getDetailedHrefArray() {

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('source');
  //получаем период, за который необходимо выгрузить данные
  var period = sheet.getRange(5,1).getValue(); 
  Logger.log(period);
  var url = "https://torgi.gov.ru/opendata/7710349494-torgi/data-13-" + period + "-structure-20130401T0000.xml";
  
  //Собираем массив ссылок на извещения
  var odDetailedHrefArray = parseData(url);
  //Logger.log(odDetailedHrefArray)
  var sheet_out = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('odDetailedHrefArray');

  sheet_out.getRange("A2:A").clearContent(); //очищаем A2:A от предыдущих импортов

  sheet_out.getRange(2, 1, odDetailedHrefArray.length, odDetailedHrefArray[0].length).setValues(odDetailedHrefArray)  //записываем результат на страницу
  
}
