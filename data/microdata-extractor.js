document.addEventListener("DOMContentLoaded", function() {
  if(document.getItems().length > 0) {
    console.log(document.title + " contains micro data");
    var semanticsDisclaimer = document.createElement("div");
    semanticsDisclaimer.innerHTML =
      '<div style="position:fixed; bottom: 1em; right: 1em; background: #ccc; border: 1px solid #555">' +
        'Microdata embeded'+
      '</div>';
    document.body.appendChild(semanticsDisclaimer);
  }
});
