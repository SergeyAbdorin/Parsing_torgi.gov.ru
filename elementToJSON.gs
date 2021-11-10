/**
   * Converts an XmlService element to a JSON object, using logic similar to
   * the sunset method Xml.parse().
   * @param {XmlService.Element} element The element to parse.
   * @returns {Object} The parsed element.
   */
  function elementToJSON(element) {
    var result = {};
    // Attributes.
    // element.getAttributes().forEach(function (attribute) {
    //   result[attribute.getName()] = attribute.getValue();
    // });
    // Child elements.
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
    // Text content.
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
