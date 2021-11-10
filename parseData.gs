function parseData(urlData) {
    var xml = UrlFetchApp.fetch(urlData).getContentText(); 
    var json = XML_to_JSON(xml);

    var result = [];
    var notifications = json["openData"]["notification"];
    if (notifications.length == null) {
      result.push([notifications["odDetailedHref"]["Text"]])
    } else {
      for (i in notifications) {
      result.push([notifications[i]["odDetailedHref"]["Text"]])
    }
    } 
    return result;
  }
