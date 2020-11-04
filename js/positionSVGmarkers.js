//position markers in the location buttons on frontpage.
//in order to avoid long svg tags in the html file.
var buttonDiv = document.querySelectorAll(".buttonDivIndex");
for (element of buttonDiv) {
  console.log(element);
  for (button of element.children) {
    button.insertBefore(
      createSVG("img/sted_pil-01.svg", "locationMarker", "locationMarker"),
      button.firstChild
    );
  }
}
