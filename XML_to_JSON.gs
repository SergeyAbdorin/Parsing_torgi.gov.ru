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
