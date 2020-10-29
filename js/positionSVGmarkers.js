var buttonDiv = document.getElementById("locationButtons");

for (element of buttonDiv.children) {
  for (button of element.children) {
    button.insertBefore(createSVG("../resources/images/sted_pil-01.svg","location-marker",'location-marker'), button.firstChild);
  }
}
