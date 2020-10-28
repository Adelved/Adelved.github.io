var map, infowindow, locationCircle
var markers = [];
var restaurants = [];
var infoBoxes = [];

//store website URLs from the API globally.
var webAdresses = [];
//parse the locally stored position object
if (localStorage.getItem("storedPosition")) {
  var position = JSON.parse(localStorage.getItem("storedPosition"));
  console.log("local storage: ", position);
} else {
  //default to solsiden if no position is found in local storage
  var position = [63.434366, 10.41075];
}

//set up the request that is passed to the map
var request = {
  location: position,
  radius: document.getElementById("radius").value,
  type: "restaurant",
  price_level: 0,
  rating: 0,
};

var parent = document.getElementById("main-page-wrapper");



function createMap() {
  var options = {
    center: position,
    zoom: 16,
    disableDefaultUI: true,
    draggable: false,
    styles: mapstyle,
    stylers: [{ visibility: "off" }],
  };

  map = new google.maps.Map(document.getElementById("map"), options);

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

  var getNextPage = null;

  function callback(results, status, pagination) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      getNextPage =
        pagination.hasNextPage &&
        function () {
          pagination.nextPage();
        };
      if (pagination.hasNextPage) {
        getNextPage();
      }

      parent = document.getElementById("main-page-wrapper");

      for (var i = 0; i < results.length; i++) {
        if (
          results[i].rating >= request.rating &&
          results[i].price_level >= request.price_level
        ) {
          if (results[i].photos) {
            createImage(parent, results[i]);
          }
          getWebsite(results[i]);
          //createMarker(results[i]);
        }
      }
    }
  }

  initCircle();

  service.nearbySearch(request, callback);

  document.getElementById("radius").addEventListener("change", function () {
    request.radius = this.value;
    radius.title = this.value + "m";

    if (infoBoxes.length > 0) {
      deleteRestaurants();
      infoBoxes = [];
    }

    if (markers.length > 0) {
      deleteMarker(markers);
    }

    initCircle();
    service.nearbySearch(request, callback);
  });

  //get numeric value of the rating
  //wait for change in the fieldset tag
  document.getElementById("pricing").addEventListener("change", function () {
    //loop through input tags to find the "checked" input tag
    for (item of document
      .getElementById("pricing")
      .getElementsByTagName("input")) {
      if (item.checked) {
        request.price_level = parseFloat(item.value); //return the checked value
      }
    }
    if (infoBoxes.length > 0) {
      deleteRestaurants();
      infoBoxes = [];
    }

    if (markers.length > 0) {
      deleteMarker(markers);
    }
    service.nearbySearch(request, callback);
  });

  //get numeric value of the rating
  //wait for change in the fieldset tag
  document.getElementById("rating").addEventListener("change", function () {
    //loop through input tags to find the "checked" input tag
    for (item of document
      .getElementById("rating")
      .getElementsByTagName("input")) {
      if (item.checked) {
        request.rating = parseFloat(item.value); //return the checked value
      }
    }
    if (infoBoxes.length > 0) {
      deleteRestaurants();
      infoBoxes = [];
    }
    if (markers.length > 0) {
      deleteMarker(markers);
    }
    service.nearbySearch(request, callback);
  });
}

function createImage(parentDiv, element) {
  //create the image element
  var img = document.createElement("img");
  var name = element.name;
  img.src = element.photos[0].getUrl({ maxWidth: 250, maxHeight: 250 });
  img.alt = name;
  //add element to class
  img.classList.add("restaurant-image");

  // create div which will contain a restuarant proposal
  var subDiv = document.createElement("div");
  subDiv.setAttribute("place_id", element.place_id);
  // add element to class
  subDiv.classList.add("restaurant-container");

  //create titlename header for each restaurant
  var subDivTitleText = document.createElement("div");
  //fetch name
  subDivTitleText.innerHTML = name;
  //add element to class
  subDivTitleText.classList.add("restaurant-title");

  var ratingDiv = createRatingDiv();
  var priceDiv = createPricingDiv();

  var restaurantRating = roundScoreValue(element.rating);
  var restaurantPricing = element.price_level;

  colorRating(ratingDiv, restaurantRating);
  colorRating(priceDiv, restaurantPricing);

  subDiv.appendChild(img);
  subDiv.appendChild(subDivTitleText);
  subDiv.appendChild(ratingDiv);
  subDiv.appendChild(priceDiv);

  parentDiv.appendChild(subDiv);
  infoBoxes.push(subDiv);
}

function getCurrentDay() {
  date = new Date();
  return date.getDay() - 1;
}


function getOpeningHours(place){
  console.log(place)
  var returnString;
  if (place.business_status !== "OPERATIONAL") {
    var todaysHours = place.business_status;
    returnString = todaysHours;
  } else {
    var todaysHours = place.opening_hours.weekday_text[getCurrentDay()];
    returnString = createTimeString(todaysHours.split(":"))
  }
  return returnString
}

function createTimeString(arr){
  var formattedString = "";
  for(var i = 1; i < arr.length; i++){
    if(i !== arr.length - 1){
      formattedString += arr[i] + ':'
    }else{
      formattedString += arr[i]
    }
    
  }
  return formattedString
}

function createRatingDiv() {
  var fieldset = document.createElement("fieldset");
  fieldset.classList.add("restaurant-rating");
  for (var i = 0; i < 5; i += 0.5) {
    var starValue = 5 - i;

    var input = document.createElement("input");
    input.type = "radio";
    input.value = starValue;
    var label = document.createElement("label");

    if (Math.floor(starValue) !== starValue) {
      label.classList.add("half");
    } else {
      label.classList.add("full");
    }

    fieldset.appendChild(input);
    fieldset.appendChild(label);
  }
  return fieldset;
}

function formatInfoWindowContent(place) {
  var infoContent =
    "<div class='infoWindowElement'><div class='infoTitle'>" +
    place.name +
    "</div><div><span>adr:</span> " +
    place.vicinity +
    "</div><div><span>Åpen:</span> " +
    getOpeningHours(place) +
    "</div><div><span>tlf:</span> " +
    place.formatted_phone_number +
    "</div><div><a href='" +
    place.website +
    "' target='_blank'>" +
    place.website +
    "</a></div><div><a href='"+place.url+"' target='_blank'>Vis i Google</a></div></div>";
    return infoContent
}

//DETAIL REQUEST - get website, phone number, total ratings, opening hours
function getWebsite(restaurant) {
  var requestDetails = {
    placeId: restaurant.place_id,
    type: ["restaurant"],
    fields: [
      "name",
      "website",
      "vicinity",
      "opening_hours",
      "business_status",
      "formatted_phone_number",
      "geometry",
      "url",
    ],
    radius: 0,
  };

  var websiteDiv = document.createElement("div");
  websiteDiv.classList.add("restaurant-website");

  service = new google.maps.places.PlacesService(map);

  function createWebsiteElement(place, parent) {
    var websiteElem = document.createElement("a");
    websiteElem.href = place.website;
    websiteElem.target = "_blank";
    websiteElem.innerText = place.name;
    websiteElem.style.color = "#df6020";
    parent.appendChild(websiteElem);
  }

  function createTextElement(place, parent) {
    var subDiv = document.createElement("div");
    subDiv.classList.add("restaurant-text");

    var openingTimeElem = document.createElement("p");
    var adressElem = document.createElement("p");
    openingTimeElem.innerText = "Åpen: " + getOpeningHours(place)

    adressElem.innerText = "Adr: " + place.vicinity;

    subDiv.appendChild(adressElem);
    subDiv.appendChild(openingTimeElem);

    parent.appendChild(subDiv);
  }
  
  //fetch the current day, 0-indexed

  service.getDetails(requestDetails, callbackDetails);

  function callbackDetails(place, status) {
    if (
      status == google.maps.places.PlacesServiceStatus.OK &&
      !webAdresses.includes(place.website)
    ) {
      
      createWebsiteElement(place, websiteDiv);
      console.log(place.name)
      createMarker(place);
      try {
        var k = document.querySelector(
          ".restaurant-container[place_id=" + restaurant.place_id + "]"
        );
        k.appendChild(websiteDiv);
        createTextElement(place, k);
      } catch (error) {
        console.log(error.message);
      }
      
      webAdresses.push(place.website);
    } else if (
      status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
    ) {
      console.log(status);
      setTimeout(function () {
        getWebsite(restaurant);
      }, 1000);
    }
  }
}

//creates the pricing tags inside each restaurant proposal
function createPricingDiv() {
  var fieldset = document.createElement("fieldset");
  fieldset.classList.add("restaurant-pricing");
  for (var i = 0; i < 4; i++) {
    var starValue = 4 - i;
    var input = document.createElement("input");
    input.type = "radio";
    input.value = starValue;
    var label = document.createElement("label");

    fieldset.appendChild(input);
    fieldset.appendChild(label);
  }
  return fieldset;
}

function roundScoreValue(score) {
  var roundedScore = (Math.round(score * 2) / 2).toFixed(1);
  return roundedScore;
}

function colorRating(ratingDiv, score) {
  var ratingTags = ratingDiv.getElementsByTagName("input");

  for (var i = 0; i < ratingTags.length; i++) {
    if (parseFloat(ratingTags[i].value) <= score) {
      ratingTags[i].nextSibling.style.color = "#df6020";
    }
  }
}

function deleteRestaurants() {
  parent = document.getElementById("main-page-wrapper");
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.lastChild);
  }
  webAdresses = [];
}

function createMarker(place) {
  var image = {
    url: "../resources/images/sted_pil-01.svg",
    scaledSize: new google.maps.Size(32, 32),
  };
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    icon: image,
  });
  markers.push(marker);
  google.maps.event.addListener(marker, "click", () => {
    if(document.getElementsByClassName("mapButtonClose")[0].childNodes[0].checked){
      infowindow.open(map);
      infowindow.setPosition(place.geometry.location);
      infowindow.setContent(formatInfoWindowContent(place));
    }
  
  });
}

function deleteMarker(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function initCircle() {
  var newCircle = new google.maps.Circle({
    strokeColor: "#df6020",
    strokeOpacity: 0.3,
    strokeWeight: 2,
    fillColor: "#df6020",
    fillOpacity: 0.1,
    map,
    center: request.location,
    radius: Math.sqrt(request.radius ** 2),
  });

  locationCircle = newCircle;
}

function deleteLocationCircle() {
  locationCircle.setMap(null);
}

function drawLocationCircle() {
  if (locationCircle) {
    locationCircle.setMap(null);
  }

  locationCircle.radius = Math.sqrt(request.radius ** 2);
}

document
  .getElementById("radius")
  .addEventListener("change", drawLocationCircle);
