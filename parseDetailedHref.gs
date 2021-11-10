function parseDetailedHref(href) {
    var xml = UrlFetchApp.fetch(href).getContentText(); 
    var json = XML_to_JSON(xml);

    var result = [];
    var property = {};
    lots = json["fullNotification"]["notification"]["lot"];
    //Проверяем лот всего один или их несколько, потому что от этого зависит имеем мы массив списков или список
    if (lots.length == null) {
      property["bidNumber"] = json["fullNotification"]["notification"]["bidNumber"]["Text"];
      property["startDate"] = new Date(json["fullNotification"]["notification"]["common"]["startDateRequest"]["Text"]);
      property["endDate"] = new Date(json["fullNotification"]["notification"]["common"]["expireDate"]["Text"]);
      property["auctionDate"] = new Date(json["fullNotification"]["notification"]["common"]["openingDate"]["Text"]);
      property["propName"] = lots["propName"]["Text"];
      property["torgReason"] = lots["torgReason"]["Text"];
      property["startPrice"] = lots["startPrice"]["Text"];
      property["depositSize"] = lots["depositSize"]["Text"];
      property["propType"] = lots["propertyType"]["name"]["Text"];
      property["status"] = lots["bidStatus"]["name"]["Text"];
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
        property["startDate"] = new Date(json["fullNotification"]["notification"]["common"]["startDateRequest"]["Text"]);
        property["endDate"] = new Date(json["fullNotification"]["notification"]["common"]["expireDate"]["Text"]);
        property["auctionDate"] = new Date(json["fullNotification"]["notification"]["common"]["openingDate"]["Text"]);
        property["propName"] = lots[lot]["propName"]["Text"];
        property["torgReason"] = lots[lot]["torgReason"]["Text"];
        property["startPrice"] = lots[lot]["startPrice"]["Text"];
        property["depositSize"] = lots[lot]["depositSize"]["Text"];
        property["propType"] = lots[lot]["propertyType"]["name"]["Text"];
        property["status"] = lots[lot]["bidStatus"]["name"]["Text"];
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
