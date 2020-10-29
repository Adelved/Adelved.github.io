const xText = "X";
const showMapText = "Vis Kart";
button = createButton("mapButtonOpen", showMapText);
var divParent = document.getElementById("mapBox");
var divElement = document.getElementById("buttonBox");
var theMap = document.getElementById("map");
divElement.appendChild(button);

button.childNodes[0].addEventListener("change", function () {
  if (this.checked) {
    theMap.setAttribute("class", "expandedMap");
    divElement.setAttribute("class", "expandedMap");
    button.setAttribute("class", "mapButtonClose");
    button.childNodes[1].nodeValue = xText;
    map.setOptions({ draggable: true });
  } else {
    divElement.setAttribute("class", "map");
    theMap.setAttribute("class", "map");
    button.setAttribute("class", "mapButtonOpen");
    button.childNodes[1].nodeValue = showMapText;
    infowindow.close();
    map.setOptions({ draggable: false });
  }
});

function createButton(className, txt) {
  var newButton = document.createElement("label");
  var input = document.createElement("input");
  input.type = "checkbox";
  newButton.appendChild(input);
  var text = document.createTextNode(txt);
  newButton.appendChild(text);
  newButton.setAttribute("class", className);

  return newButton;
}
