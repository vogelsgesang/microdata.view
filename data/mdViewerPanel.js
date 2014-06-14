"use strict";
//hides all pages and only shows the specified one
function showPage(name) {
  var pages = ["loading", "no-microdata", "microdata"]
  for(var i = 0; i < pages.length; i++) {
    document.getElementById(pages[i]).style.display = "none";
  }
  document.getElementById(name).style.display = "block";
}
showPage("loading");

//updates the view
self.port.on("updateMicroData", displayMicroData);
function displayMicroData(microData) {
  var items = microData.items;
  if(items.length > 0) {
    document.getElementById("json").textContent = JSON.stringify(items, null, 2);
    showPage("microdata");
  } else {
    showPage("no-microdata");
  }
}

//asks for the extraction of microdata from the current web page
function reloadMicroData() {
  showPage("loading");
  self.port.emit("extractMicroData");
}

//reload microdata on "show" event
self.port.on("show", reloadMicroData);
//a direct call is necessary since (on the first load) we might have
//already missed the "show" message.
reloadMicroData();
