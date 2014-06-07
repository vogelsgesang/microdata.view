"use strict";

window.addEventListener("unload", function() {
  self.port.emit("unload");
});

function extractMicroDataFromItem(item) {
  var data = {};
  if(item.itemType.length > 0) {
    var extractedTypes = [];
    for(var typeNr = 0; typeNr < item.itemType.length; typeNr++) {
      extractedTypes.push(item.itemType[typeNr]);
    }
    data['type'] = extractedTypes;
  }
  if(item.itemId !== "") {
    data['id'] = item.itemId;
  }
  var extractedProperties = {};
  for(var propertyNr = 0; propertyNr < item.properties.names.length; propertyNr++) {
    var propName = item.properties.names[propertyNr];
    var valueNodes = item.properties[propName];
    var extractedValues = [];
    for(var valueNr = 0; valueNr < valueNodes.length; valueNr++) {
      var value = valueNodes[valueNr].itemValue
      if(value instanceof Element) {
        value = extractMicroDataFromItem(value);
      }
      extractedValues.push(value);
    }
    extractedProperties[propName] = extractedValues;
  }
  data['properties'] = extractedProperties;
  return data;
}

function extractMicroData() {
  var extractedItems = [];
  var items = document.getItems();
  for(var itemNr = 0; itemNr < items.length; itemNr++) {
    var item = items[itemNr];
    extractedItems.push(extractMicroDataFromItem(item));
  }
  return {items: extractedItems};
}

self.port.on("extractMicroData", function() {
  var microData = extractMicroData();
  self.port.emit("returnMicroData", microData);
});
