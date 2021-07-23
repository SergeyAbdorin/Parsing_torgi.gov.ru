function parseOpenData() {
  /*Кусок кода с функциями XML_to_JSON() и elementToJSON() - не мой, я лишь внес некоторые правки. под свою задачу. Оригинал по ссылке ниже*/
  /* Source: https://gist.github.com/erickoledadevrel/6b1e9e2796e3c21f669f */
  /**
   * Converts an XML string to a JSON object, using logic similar to the
   * sunset method Xml.parse().
   * @param {string} xml The XML to parse.
   * @returns {Object} The parsed XML.
   */
  function XML_to_JSON(xml) {
    var doc = XmlService.parse(xml);
    var result = {};
    var root = doc.getRootElement();
    result[root.getName()] = elementToJSON(root);
    return result;
  }

  /**
   * Converts an XmlService element to a JSON object, using logic similar to
   * the sunset method Xml.parse().
   * @param {XmlService.Element} element The element to parse.
   * @returns {Object} The parsed element.
   */
  function elementToJSON(element) {
    var result = {};
    element.getChildren().forEach(function (child) {
      var key = child.getName();
      var value = elementToJSON(child);
      if (result[key]) {
        if (!(result[key] instanceof Array)) {
          result[key] = [result[key]];
        }
        result[key].push(value);
      } else {
        result[key] = value;
      }
    });
    if (element.getText()) {
      if (/^\s*$/.test(element.getText())) {
        result['Text'] = "";
      }
      else {
        result['Text'] = element.getText();
      }
    }
    return result;
  }

  //Получает ссылку на открытые данные и собирает все ссылки на извещения
  //На выходе отдает массив ссылок
  function parseOpenData(urlData) {
    var xml = UrlFetchApp.fetch(urlData).getContentText(); 
    var json = XML_to_JSON(xml);

    var result = [];
    var notifications = json["openData"]["notification"];
    if (notifications.length == null) {
      result.push(notifications["odDetailedHref"]["Text"])
    } else {
      for (i in notifications) {
      result.push(notifications[i]["odDetailedHref"]["Text"])
    }
    } 
    return result;
  }

  //Получает ссылку на извещение и собирает информацию по лотам
  //На выходе отдает двумерный массив со списками по каждому лоту
  function parseDetailedHref(href) {
    var xml = UrlFetchApp.fetch(href).getContentText(); 
    var json = XML_to_JSON(xml);

    var result = [];
    var property = {};
    lots = json["fullNotification"]["notification"]["lot"];
    //Проверяем лот всего один или их несколько, потому что от этого зависит имеем мы массив списков или список
    if (lots.length == null) {
      property["bidNumber"] = json["fullNotification"]["notification"]["bidNumber"]["Text"];
      property["propName"] = lots["propName"]["Text"];
      property["propId"] = lots["propertyType"]["id"]["Text"];
      property["startPrice"] = lots["startPrice"]["Text"];
      property["propType"] = lots["propertyType"]["name"]["Text"];
      try {
        property["address"] = lots["fiasLocation"]["name"]["Text"] + ", " + lots["location"]["Text"];
      }
      catch {
        property["address"] = lots["fiasLocation"]["name"]["Text"] + ".";
      }
      property["notificationUrl"] = json["fullNotification"]["notification"]["common"]["notificationUrl"]["Text"];
      result.push(property)
    }
    else {
      for (lot in lots) {
        property = {};
        property["bidNumber"] = json["fullNotification"]["notification"]["bidNumber"]["Text"];
        property["propName"] = lots[lot]["propName"]["Text"];
        property["propId"] = lots[lot]["propertyType"]["id"]["Text"];
        property["startPrice"] = lots[lot]["startPrice"]["Text"];
        property["propType"] = lots[lot]["propertyType"]["name"]["Text"];
        try {
          property["address"] = lots[lot]["fiasLocation"]["name"]["Text"] + ", " + lots[lot]["location"]["Text"];
        }
        catch {
          property["address"] = lots[lot]["fiasLocation"]["name"]["Text"] + ".";
        }
        
        property["notificationUrl"] = json["fullNotification"]["notification"]["common"]["notificationUrl"]["Text"];
        result.push(property)
      }
    } 
    return result;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('source');
  
  //получаем период, за который необходимо выгрузить данные
  //берем его из ячейки А5. Он должен быть в формате "20210715T000-20210723T2359"
  var period = sheet.getRange(5,1).getValue(); 
  
  //У меня стояла задача спарсить только торги по имуществу должников, поэтому в url указываю "data-13". 
  //Если нужно получить Другие торги, то необходимо заменить его на соответствующий номер.
  //Подробнее на https://torgi.gov.ru/opendata/recommendation.html
  var url = "https://torgi.gov.ru/opendata/7710349494-torgi/data-13-" + period + "-structure-20130401T0000.xml";
  
  //Собираем массив ссылок на извещения
  var odDetailedHrefArray = parseOpenData(url);
  var propArray = [];

  //Проходим по каждой ссылке и собираем информацию по каждому лоту
  for (i in odDetailedHrefArray) {
    propArray.push(parseDetailedHref(odDetailedHrefArray[i]));
  }
  //Т.к. данные по торгам заполняются госслужащими вручную, то часто они допускают ошибки. Например в VIN номерах используют кириллицу
  //словарь соответствия кириллицы и латиницы
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

  sheet.getRange("source!A7:Z").clearContent(); //очищаем A7:Z от предыдущих импортов
  
  var row = 7;
  var col;
  var kad,vin, vinOut;
  var kadArray, vinArray = [];
  //Записываем данные в таблицу
  for (notice in propArray) {
    for (lot in propArray[notice]) {
      col = 1;
      sheet.getRange(row, col).setValue(propArray[notice][lot]["bidNumber"]);
      col += 1;
      sheet.getRange(row, col).setValue(propArray[notice][lot]["propId"]);
      col += 1;
      sheet.getRange(row, col).setValue(propArray[notice][lot]["propType"]);
      col += 1;
      sheet.getRange(row, col).setValue(propArray[notice][lot]["propName"]);
      col += 1;
      sheet.getRange(row, col).setValue(propArray[notice][lot]["startPrice"]);
      col += 1;
      sheet.getRange(row, col).setValue(propArray[notice][lot]["notificationUrl"]);
      col += 1;
      sheet.getRange(row, col).setValue(propArray[notice][lot]["address"]);
      col += 1;
      try {
        kadArray = []
        //С помощью регулярного выражения ищем кадастровые номера в описании лота. Но так как довольно часто бывают в них ошибки, например "23:32::23435:324"
        //Видим, что в примере стоит 2 двоеточия подряд, хотя такого быть не должно. Поэтому находим даже такие ошибочные номера и очищаем их от лишних деталей.
        kad = propArray[notice][lot]["propName"].match(/\d{1,}\s{0,}[.,]{0,}\s{0,}\d{0,}\s{0,}[:;]{0,}\s{0,}[:;]{1,}\s{0,}\d{0,}\s{0,}[.,]{0,}\s{0,}\d{0,}\s{0,}[:;]{0,}\s{0,}[:;]{0,}\s{0,}[:;]{1,}\s{0,}\d{0,}\s{0,}[.,]{0,}\s{0,}\d{0,}\s{0,}[:;]{0,}\s{0,}[:;]{1,}\s{0,}\d{0,}/g)
        for (i in kad) {
          kad[i] = kad[i].replace(/\s+/gi, "").replace(/[;]/g, ":").replace(/:{1,}/g, ":").replace(/[.,]/g, "");
        }
        kadArray.push(kad)
        sheet.getRange(row, col, kadArray.length, kadArray[0].length).setValues(kadArray)
      }
      catch {
        try {
          vinArray = [];
          vin = propArray[notice][lot]["propName"].match(/[A-ZА-Я0-9]{17}/g);
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
          sheet.getRange(row, col, vinArray.length, vinArray[0].length).setValues(vinArray);
        }
        catch {

        }
        
      }
      row += 1;
    }
  } 

  //Начальную стоимость лота мы получаем в виде числа с точкой, поэтому заменяем точку на запятую, чтобы google sheet распознал ее как число.
  var range = sheet.getRange("E7:E");
  range.setValues(range.getValues().map(function(row) {
    return [row[0].toString().replace(".", ",")];
  }));
}
