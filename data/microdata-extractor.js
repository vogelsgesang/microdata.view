document.addEventListener("DOMContentLoaded", function() {
  var containsMicroData = document.getItems().length > 0;
  self.port.emit("reportMicroData", containsMicroData);
});
