var ui = require("sdk/ui");
var pagemod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var panel = require("sdk/panel");

//stores all the currently active workers
var workers = {};
//add a worker to every site
pagemod.PageMod({
  include: ["file://*", "*"],
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

//the panel will be created lazily
var mdViewerPanel = null;
//responsible for creating the panel.
function createMdViewerPanel() {
  var mdPanel = panel.Panel({
    contentURL: require("sdk/self").data.url("mdViewerPanel.html"),
    position: showMdButton,
    onHide: handlePanelHide
  });
  return mdPanel;
}

//create the toggle button
var showMdButton = ui.ToggleButton({
  id: "show-microdata",
  label: "Show MicroData",
  icon: {
    "32": "./HTML5_Semantics_32.png",
    "64": "./HTML5_Semantics_64.png"
  },
  onChange: handleButtonChange
});

//clue button and panel together
function handleButtonChange(state) {
  if (state.checked) {
    if(!mdViewerPanel) {
      mdViewerPanel = createMdViewerPanel();
    }
    mdViewerPanel.show();
    var worker = workers[tabs.activeTab.id];
    if(worker) {
      worker.port.once("returnMicroData", function(data) {
        console.log(JSON.stringify(data));
      });
      worker.port.emit("extractMicroData");
    } else {
      console.error("no worker associated with this tab");
    }
  } else {
    if(mdViewerPanel) {
      mdViewerPanel.hide();
    }
  }
}
function handlePanelHide() {
  showMdButton.state('window', {checked: false});
}

//hide the panel, if the currently active tab is changed
tabs.on('activate', function() {
  if(mdViewerPanel) {
    mdViewerPanel.hide();
  }
});

//track the currently active tag for page changes and hide the mdViewerPanel
tabs.on('deactivate', function(tab) {
  tab.removeListener('pageshow', pageChange);
});
tabs.on('activate', function(tab) {
  tab.on('pageshow', pageChange);
});
function pageChange() {
  mdViewerPanel.hide();
}
