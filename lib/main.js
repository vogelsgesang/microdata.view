"use strict";
var ui = require("sdk/ui");
var pagemod = require("sdk/page-mod");
var self = require("sdk/self");

pagemod.PageMod({
  include: "*",
  contentScriptWhen: "start",
  attachTo: ["existing", "top"],
  contentScriptFile: self.data.url("microdata-extractor.js"),
  disabled: true
});
