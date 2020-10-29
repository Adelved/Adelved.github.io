var buttonDiv = document.getElementById("locationButtons");

function createSVG() {
  var img = document.createElement("img");
  img.src = "../resources/images/sted_pil-01.svg";
  img.alt = "locationMarker";
  img.setAttribute("class", "location-marker");
  return img;
}

for (element of buttonDiv.children) {
  for (button of element.children) {
    button.insertBefore(createSVG(), button.firstChild);
  }
}
