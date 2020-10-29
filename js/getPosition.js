var position = {
  lat: 0,
  lng: 0,
};

console.log('GETPOSITIONS')

var preDefPositions = [
  [63.434366, 10.41075],
  [63.429997, 10.393237],
  [63.431348, 10.371356],
  [63.429399, 10.404033],
  [63.441463, 10.432277],
  [0, 0],
];

var positionObject = {};

function createObject(element, index) {
  positionObject.name = element.firstElementChild.innerText;
  positionObject.lat = preDefPositions[index][0];
  positionObject.lng = preDefPositions[index][1];
  return positionObject;
}

var buttons = document.querySelectorAll("#locationButtons button");
buttons.forEach((element) => console.log(element.innerText))

buttons.forEach((element, index) =>
  element.addEventListener("click", function () {
    
    if (element.id === "lucky") {
      var pos = createObject(element, Math.floor(Math.random() * 5));
    } else {
      var pos = createObject(element, index);
    }
    position.lat = pos.lat;
    position.lng = pos.lng;
    localStorage.setItem("storedPosition", JSON.stringify(position));
  })
);
