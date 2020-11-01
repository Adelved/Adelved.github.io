function locationsToButtons(buttons){
    var pos;
   
    function randomNumber(max){

      return Math.floor(Math.random() * (max))
    }
    
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
  
    buttons.forEach((element, index) => 
      element.addEventListener("click", function () {
        if (element.id === "lucky") {
          var randomLocation = randomNumber(preDefPositions.length-1)
          pos = createObject(buttons[randomLocation],randomLocation)
          sessionStorage.setItem('storedPosition', JSON.stringify(pos))
        } else {
          pos = createObject(element, index)
          sessionStorage.setItem('storedPosition', JSON.stringify(pos))
        }
        
      })
      
      
    );
    

}