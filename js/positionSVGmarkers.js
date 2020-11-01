var buttonDiv = document.querySelectorAll("#locationButtons button");

for (element of buttonDiv) {
  console.log(element)
  for (button of element.children) {
    button.insertBefore(createSVG("../resources/images/sted_pil-01.svg","location-marker",'location-marker'), button.firstChild);
  }
}
