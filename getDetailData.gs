function getDetailData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('odDetailedHrefArray');
  var count_row = sheet.getLastRow(); 
  var odDetailedHrefArray = sheet.getRange("A2:A"+count_row).getValues();
  Logger.log(odDetailedHrefArray.length)
  var propArray = [];
  var dict = {
    "А": "A",
    "В": "B",
    "Е": "E",
    "К": "K",
    "М": "M",
    "Н": "H",
    "О": "O",
    "Р": "P",
    "С": "C",
    "Т": "T",
    "У": "Y",
    "Х": "X"
  }
  var sheet_out = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('source');
  sheet_out.getRange("A7:Z").clearContent(); //очищаем A7:Z от предыдущих импортов

  var row = 7;
  var col;
  var kad,vin, vinOut;
  var kadArray, vinArray = [];

  //Проходим по каждой ссылке и собираем информацию по каждому лоту
  for (i in odDetailedHrefArray) {
    //Logger.log(odDetailedHrefArray[i]);
    propArray = parseDetailedHref(odDetailedHrefArray[i]);
    for (lot in propArray) {
      col = 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["bidNumber"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["propType"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["propName"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["torgReason"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["status"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["startPrice"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["depositSize"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["startDate"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["endDate"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["auctionDate"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["notificationUrl"]);
      col += 1;
      sheet_out.getRange(row, col).setValue(propArray[lot]["address"]);
      col += 1;
      try {
        kadArray = []
        kad = propArray[lot]["propName"].match(/\d{1,}\s{0,}[.,]{0,}\s{0,}\d{0,}\s{0,}[:;]{0,}\s{0,}[:;]{1,}\s{0,}\d{0,}\s{0,}[.,]{0,}\s{0,}\d{0,}\s{0,}[:;]{0,}\s{0,}[:;]{0,}\s{0,}[:;]{1,}\s{0,}\d{0,}\s{0,}[.,]{0,}\s{0,}\d{0,}\s{0,}[:;]{0,}\s{0,}[:;]{1,}\s{0,}\d{0,}/g)
        for (i in kad) {
          kad[i] = kad[i].replace(/\s+/gi, "").replace(/[;]/g, ":").replace(/:{1,}/g, ":").replace(/[.,]/g, "");
        }
        kadArray.push(kad)
        sheet_out.getRange(row, col, kadArray.length, kadArray[0].length).setValues(kadArray)
        //Logger.log(kadArray)
      }
      catch {
        try {
          vinArray = [];
          vin = propArray[lot]["propName"].match(/[A-ZА-Я0-9]{17}/g);
          //Циклом проходим по каждому VINу из массива, затем по каждому из них посимвольно и если встречаем символ кириллицей, то заменяем его на аналогичный из латиницы
          for (i in vin) { 
            vinOut = "";
            for (j in vin[i]) {
              if (vin[i][j] in dict) {
                vinOut += dict[vin[i][j]];
              }
              else {
                vinOut += vin[i][j];
              }
            }
            vin[i] = vinOut;
          }
          vinArray.push(vin);
          sheet_out.getRange(row, col, vinArray.length, vinArray[0].length).setValues(vinArray);
        }
        catch {

        }
      }
      row += 1;
    }
  }
  

  for (notice in propArray) {
    
  }
}
