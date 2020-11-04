//text constants for close and open button
const xText = "X";
const showMapText = "Vis Kart";

//initilize the elements with appropriate classes
button = createButton("mapButtonOpen", showMapText);
var divParent = document.getElementById("mapBox");
var divElement = document.getElementById("buttonBox");
var theMap = document.getElementById("map");
divElement.appendChild(button);

//add eventlistener to button, select class and innerText based on checked status
button.childNodes[0].addEventListener("change", function () {
  if (this.checked) {
    theMap.setAttribute("class", "expandedMap");
    divElement.setAttribute("class", "expandedMap");
    button.setAttribute("class", "mapButtonClose");
    button.childNodes[1].nodeValue = xText;
    map.setOptions({ draggable: true }); //only dragable when map is expanded
  } else {
    divElement.setAttribute("class", "map");
    theMap.setAttribute("class", "map");
    button.setAttribute("class", "mapButtonOpen");
    button.childNodes[1].nodeValue = showMapText;
    infowindow.close(); //close any open infowindows if map is closed
    map.setOptions({ draggable: false });
  }
});

//create button for the map
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
