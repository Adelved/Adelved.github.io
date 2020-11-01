function locationsToButtons(buttons){
    var position = {
      lat: 0,
      lng: 0,
    };
   
    
    var preDefPositions = [
      [63.434366, 10.41075], //SOLSIDEN
      [63.429997, 10.393237], //SENTRUM
      [63.429191, 10.367323], //ILA
      [63.429399, 10.404033], //BAKKLANDET
      [63.442531, 10.433532], //LADE //PRØV LYKKEN
    ];

    var positionObject = {};    


    function createObject(element, index) {
      positionObject.name = element.firstElementChild.innerText;
      positionObject.lat = preDefPositions[index][0];
      positionObject.lng = preDefPositions[index][1];
      return positionObject;
    }
    
    buttons.forEach((element,index) => console.log(createObject(element,index)))
    
    buttons.forEach((element, index) =>
      element.addEventListener("click", function () {

        if (element.id === "lucky") {
          var pos = createObject(element, Math.floor(Math.random() * 5));
        } else {
          var pos = createObject(element, index);
          console.log(pos)
        }
        position.lat = pos.lat;
        position.lng = pos.lng;
        
        localStorage.setItem("storedPosition", JSON.stringify(pos));
      })
    );
    }

