//create image element
function createSVG(source, alt, className) {
  var img = document.createElement("img");
  img.src = source;
  img.alt = alt;
  img.setAttribute("class", className);
  return img;
}
