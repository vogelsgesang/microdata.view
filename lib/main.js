"use strict";
var ui = require("sdk/ui");
var pagemod = require("sdk/page-mod");
var self = require("sdk/self");

var showMdButton = ui.ActionButton({
  id: "show-microdata",
  label: "Show MicroData",
  disabled: true,
  icon: {
    "32": "./HTML5_Semantics_32.png",
    "64": "./HTML5_Semantics_64.png"
  },
  onClick: function(state) {
    window.alert("This page contains MicroData");
  }
});

pagemod.PageMod({
  include: "*",
  contentScriptWhen: "start",
  attachTo: ["existing", "top"],
  contentScriptFile: self.data.url("microdata-extractor.js"),
  onAttach: function(worker) {
    worker.port.on("reportMicroData", function(containsMicroData) {
      showMdButton.state(worker.tab, {disabled: !containsMicroData});
    });
  }
});

