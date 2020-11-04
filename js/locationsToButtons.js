function locationsToButtons(buttons) {
  var pos; //define position variable

  //return a random number in the range (0,max)
  function randomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  var preDefPositions = [
    [63.434366, 10.41075], //SOLSIDEN
    [63.429997, 10.393237], //SENTRUM
    [63.429191, 10.367323], //ILA
    [63.429399, 10.404033], //BAKKLANDET
    [63.442531, 10.433532], //LADE
  ];

  //define the position object
  var positionObject = {};

  //add values to the object : lattitude, longitude and name of location
  function createObject(element, index) {
    positionObject.name = element.firstElementChild.innerText;
    positionObject.lat = preDefPositions[index][0];
    positionObject.lng = preDefPositions[index][1];
    return positionObject;
  }

  //loop through buttons and add eventlistener. on click the correct position object will be sendt to the sessionStorage.
  buttons.forEach((element, index) =>
    element.addEventListener("click", function () {
      if (element.id === "lucky") {
        //randomly select one of the 5 predefined positions for "PRØV LYKKEN"
        var randomLocation = randomNumber(preDefPositions.length - 1);
        pos = createObject(buttons[randomLocation], randomLocation);
        sessionStorage.setItem("storedPosition", JSON.stringify(pos));
      } else {
        pos = createObject(element, index);
        sessionStorage.setItem("storedPosition", JSON.stringify(pos));
      }
    })
  );
}
