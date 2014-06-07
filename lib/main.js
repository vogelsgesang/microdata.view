"use strict";
var ui = require("sdk/ui");
var pagemod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
var self = require("sdk/self");

//stores all the currently active workers
var workers = {};
//add a worker to every site
pagemod.PageMod({
  include: "*",
  contentScriptWhen: "start",
  attachTo: ["existing", "top"],
  contentScriptFile: self.data.url("microdata-extractor.js"),
  onAttach: function(worker) {
    //store a reference to the worker
    var tabId = worker.tab.id
    workers[tabId] = worker;
    //remove the reference to the worker when the tab is unloaded
    worker.port.on("unload", function() {
      if(workers[tabId] == worker) {
        delete workers[tabId];
      }
    });
  }
});

var showMdButton = ui.ActionButton({
  id: "show-microdata",
  label: "Show MicroData",
  icon: {
    "32": "./HTML5_Semantics_32.png",
    "64": "./HTML5_Semantics_64.png"
  },
  onClick: function(state) {
    var worker = workers[tabs.activeTab.id];
    if(worker) {
      worker.port.once("returnMicroData", function(data) {
        console.log(JSON.stringify(data));
      });
      worker.port.emit("extractMicroData");
    } else {
      console.error("no worker associated with this tab");
    }
  }
});
