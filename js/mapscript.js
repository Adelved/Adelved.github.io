var map; //variable for map
var locationCircle; //variable for the circle on the map

//list holding the markers and infoboxes (pop-up boxes on the map) created with the api
var markers = [];
var infoBoxes = [];

//parse the position from the sessionStorage
if (window.sessionStorage.getItem("storedPosition")) {
  var position = JSON.parse(window.sessionStorage.getItem("storedPosition"));
} else {
  //default to SOLSIDEN if no position is found in sessionstorage
  var position = { name: "SOLSIDEN", lat: 63.434366, lng: 10.41075 };
}

//set the current location active in the dropdown menue
function setCurrentActive(position) {
  var buttons = document.querySelectorAll(".dropdownContent a");
  buttons.forEach((element, index) => {
    if (element.firstChild.firstChild.innerText === position.name) {
      element.firstChild.style.color = "#df6020";
      buttons[index].style.color = "#df6020";
      document.querySelector(".dropbtn").innerText = position.name;
    }
  });
}

//set up the initial request that is passed to the map.
var request = {
  location: position, //location from sessionStorage
  radius: 500, //search radius
  type: "restaurant", //type of business to fetch from the api
  price_level: 4,
  rating: 0,
};

var parent = document.getElementById("mainPageWrapper");
setCurrentActive(position);

//Callback function passed to the api.
//Returns the data from the api and creates the elements on the page.
//This function runs one time once the DOM is loaded.
function createMap() {
  //initilize the map options
  var options = {
    center: position,
    zoom: 16,
    disableDefaultUI: true,
    draggable: false,
    styles: mapstyle,
    stylers: [{ visibility: "off" }],
  };

  //create map object in the map element
  map = new google.maps.Map(document.getElementById("map"), options);

  //create infowindow object
  infowindow = new google.maps.InfoWindow();

  //initilize the placesService object with the map object
  var service = new google.maps.places.PlacesService(map);

  //callback function
  //returns a maximum of 20 restaurants. Can be expanded to make unlimited queries to the palces API.
  //However, due to the related costs we limit it the 20 (the default).
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      parent = document.getElementById("mainPageWrapper");

      for (var i = 0; i < results.length; i++) {
        if (results[i].photos) {
          createRestaurantContainer(parent, results[i]); //creating the restaurant container with results from api (nearbySearch)
        }
        getAdditionalDetails(results[i]); //get addtional details from the getDetails API (which are not available through the nearbySerach)
      }
    }
  }

  initCircle(); //initialize the circle

  //make nearbySearch request
  service.nearbySearch(request, callback);
}

//create a fieldset for rating, similar to the one in find-restaurant.html
function createRatingDiv() {
  var fieldset = document.createElement("fieldset");
  fieldset.classList.add("restaurantRating");
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

//create the containers which are placed in the mainPageWrapper
function createRestaurantContainer(parentDiv, element) {
  //create the image element
  var img = document.createElement("img");
  var name = element.name;
  img.src = element.photos[0].getUrl({ maxWidth: 250, maxHeight: 250 });
  img.alt = name;
  //add element to class
  img.classList.add("restaurantImage");

  // create div which will contain a restuarant proposal
  //custom attributes added. Used when selecting on price, rating and location
  var subDiv = document.createElement("div");
  subDiv.setAttribute("place_id", element.place_id);
  subDiv.setAttribute("price_level", element.price_level);
  subDiv.setAttribute("rating", element.rating);
  subDiv.setAttribute("geometry", element.geometry.location);

  //add element to class
  subDiv.classList.add("restaurantContainer");

  //create titlename header for each restaurant
  var subDivTitleText = document.createElement("div");
  subDivTitleText.innerHTML = name;
  subDivTitleText.classList.add("restaurantTitle");

  //creating the rating/pricing divs
  var ratingFieldset = createRatingDiv();
  var pricingFieldset = createPricingDiv();

  var restaurantRating = roundScoreValue(element.rating);
  var restaurantPricing = element.price_level;

  colorRatingPricing(ratingFieldset, restaurantRating);
  colorRatingPricing(pricingFieldset, restaurantPricing);

  var contentWrapper = document.createElement("div");
  contentWrapper.setAttribute("class", "restaurantContentWrapper");

  subDiv.appendChild(img);
  subDiv.appendChild(subDivTitleText);
  subDiv.appendChild(ratingFieldset);
  subDiv.appendChild(pricingFieldset);
  parentDiv.appendChild(subDiv);
  infoBoxes.push(subDiv);
}

//returns the current day.
//changed from (0-6 = saturaday-sunday) to (0-6 = monday - sunday) to comply with the google objects
function getCurrentDay() {
  var returnDate;
  date = new Date();
  if (date.getDay() === 0) {
    returnDate = 6;
  } else {
    returnDate = date.getDay() - 1;
  }
  return returnDate;
}

//Format the returned opening hours string.
function createTimeString(arr) {
  var formattedString = "";
  for (var i = 1; i < arr.length; i++) {
    if (i !== arr.length - 1) {
      formattedString += arr[i] + ":";
    } else {
      formattedString += arr[i];
    }
  }
  return formattedString;
}

//returns the opening hours of the restaurant
function getOpeningHours(place) {
  var returnString;

  if (place.business_status !== "OPERATIONAL") {
    var todaysHours = place.business_status;
    returnString = todaysHours;
  } else {
    try {
      var todaysHours = place.opening_hours.weekday_text[getCurrentDay()];

      returnString = createTimeString(todaysHours.split(":"));
    } catch {
      var todaysHours = "Utilgjengelig";
      returnString = todaysHours;
    }
  }
  return returnString;
}

//format the elements of the information window (pop-up boxes when markers are clicked on map)
function formatInfoWindowContent(place) {
  var infoContent =
    "<div class='infoWindowElement'><div class='infoTitle'>" +
    place.name +
    "</div><div><span>adr:</span> " +
    formatAddress(place) +
    "</div><div><span>åpen:</span> " +
    getOpeningHours(place) +
    "</div><div><span>tlf:</span> " +
    place.formatted_phone_number +
    "</div><div><a href='" +
    place.website +
    "' target='_blank'>" +
    place.website +
    "</a></div><div><a href='" +
    place.url +
    "' target='_blank'>Vis i Google</a></div></div>";
  return infoContent;
}

//create the <a></a> tag with the needed properties
function createWebsiteElement(place, parent) {
  var websiteElem = document.createElement("a");
  websiteElem.href = place.website;
  websiteElem.target = "_blank";
  websiteElem.innerText = place.name;
  websiteElem.style.color = "#df6020";
  parent.appendChild(websiteElem);
}

//format long address fields
function formatAddress(place) {
  var returnString;
  if (place.vicinity.split(",").length > 2) {
    returnString = place.vicinity.split(",")[0] + ", Trondheim";
  } else {
    returnString = place.vicinity;
  }
  return returnString;
}

//create the text content within the restaurantContainer
function createTextElement(place, parent) {
  var subDiv = document.createElement("div");
  subDiv.classList.add("restaurantText");
  var openingTimeElem = document.createElement("p");
  var adressElem = document.createElement("p");

  openingTimeElem.innerText = "Åpen: " + getOpeningHours(place);
  adressElem.innerText = "Adr: " + formatAddress(place);
  subDiv.appendChild(adressElem);
  subDiv.appendChild(openingTimeElem);
  parent.appendChild(subDiv);
}

//creates the pricing tags inside each restaurant proposal
function createPricingDiv() {
  var fieldset = document.createElement("fieldset");
  fieldset.classList.add("restaurantPricing");
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

//round restaurant rating score to nearest 0.5.
function roundScoreValue(score) {
  var roundedScore = (Math.round(score * 2) / 2).toFixed(1);
  return roundedScore;
}

//color the stars in the rating of the restaurantContainers
function colorRatingPricing(ratingFieldset, score) {
  var ratingTags = ratingFieldset.getElementsByTagName("input");
  if (score > 0) {
    for (var i = 0; i < ratingTags.length; i++) {
      if (parseFloat(ratingTags[i].value) <= score) {
        ratingTags[i].nextSibling.style.color = "#df6020";
      }
    }
  } else {
    //style rating/pricing = 0 with low opacity and title
    for (var i = 0; i < ratingTags.length; i++) {
      ratingTags[i].nextSibling.style.opacity = "0.2";
    }
    ratingFieldset.title = "Ingen vurdering";
  }
}

//create markers using the place/restaurant location and place on map
function createMarker(place) {
  //define marker image
  var image = {
    url: "/img/sted_pil-01.svg",
    scaledSize: new google.maps.Size(32, 32),
  };
  //create marker object
  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
    icon: image,
    place_id: place.place_id,
  });
  //push to global list
  markers.push(marker);
  //google maps event listener on click -> open infowindow
  google.maps.event.addListener(marker, "click", () => {
    if (
      document.getElementsByClassName("mapButtonClose")[0].childNodes[0].checked
    ) {
      infowindow.open(map);
      infowindow.setPosition(place.geometry.location);
      infowindow.setContent(formatInfoWindowContent(place));
    }
  });
}

//DETAIL REQUEST - get website, phone number, total ratings, opening hours
function getAdditionalDetails(restaurant) {
  //specify the fields to request from the restaurant with ID === place_id
  var requestDetails = {
    placeId: restaurant.place_id,
    type: ["restaurant"],
    fields: [
      "place_id",
      "name",
      "website",
      "vicinity",
      "opening_hours",
      "business_status",
      "formatted_phone_number",
      "geometry",
      "url",
    ],
    radius: request.radius,
  };

  var websiteDiv = document.createElement("div");
  websiteDiv.classList.add("restaurantWebsite");

  //create placesService object with the map
  service = new google.maps.places.PlacesService(map);

  //callback function for the additional details requests
  function callbackDetails(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createWebsiteElement(place, websiteDiv);
      createMarker(place);
      try {
        var k = document.querySelector(
          ".restaurantContainer[place_id=" + restaurant.place_id + "]"
        );
        k.appendChild(websiteDiv);
        createTextElement(place, k);
      } catch (error) {
        console.log(error.message); //log error
      }
    } else if (
      status == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT //set timeout if api exceeds the query limit
    ) {
      setTimeout(function () {
        getAdditionalDetails(restaurant);
      }, 1500);
    }
  }
  //make getDetails api call
  service.getDetails(requestDetails, callbackDetails);
}

//initilize the area circle (locationCircle)
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

function drawLocationCircle() {
  if (locationCircle) {
    locationCircle.setMap(null);
  }
  locationCircle.radius = Math.sqrt(request.radius ** 2);
}

//from map, remove the marker of the input restaurant based on the place_id attribute
function removeRestaurantMarkers(restaurant) {
  for (var j = 0; j < markers.length; j++) {
    if (markers[j].place_id === restaurant.getAttribute("place_id")) {
      markers[j].setMap(null);
    }
  }
}

//make all markers visible on the map
function setMarkersVisible() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}



var ratingDIV = document.getElementById("rating").getElementsByTagName("input")
var pricingDIV = document.getElementById("pricing").getElementsByTagName("input")
//get numeric value of the price level
//wait for change in the fieldset tag
//loop through restaurants, remove restaurant container and the corresponding map marker on pricing and rating criteria
document.getElementById("pricing").addEventListener("change", function () {
  //assign rating and price_level to request
  assignRatingValue(ratingDIV)
  assignPriceValue(pricingDIV)
  //get restaurant containers
  var restaurants = document.querySelectorAll(
    "#mainPageWrapper .restaurantContainer"
  );
  //set all markers visible
  setMarkersVisible();
  for (var i = 0; i < restaurants.length; i++) {
    restaurants[i].style.display = "unset";
    if (restaurants[i].getAttribute("price_level") > request.price_level || restaurants[i].getAttribute("rating") < request.rating) {
      removeRestaurantMarkers(restaurants[i]);
      restaurants[i].style.display = "none";
    } else {
      restaurants[i].style.display = "unset";
    }
  }
});

//get numeric value of the rating
//wait for change in the fieldset tag
//loop through restaurants, remove restaurant container and the corresponding map marker on rating and pricing criteria
document.getElementById("rating").addEventListener("change", function () {
  //assign rating and price_level to request
  assignRatingValue(ratingDIV)
  assignPriceValue(pricingDIV)
  var restaurants = document.querySelectorAll(
    "#mainPageWrapper .restaurantContainer"
  );
  //set all markers visible
  setMarkersVisible();
  for (var i = 0; i < restaurants.length; i++) {
    restaurants[i].style.display = "unset";
    if (restaurants[i].getAttribute("rating") < request.rating || restaurants[i].getAttribute("price_level") > request.price_level) {
      removeRestaurantMarkers(restaurants[i]);
      restaurants[i].style.display = "none";
    } else {
      restaurants[i].style.display = "unset";
    }
  }
});

//loop through rating form and assign the value of the checked element to the request object
function assignRatingValue(tag){
  for (item of tag) {
    if (item.checked) {
      request.rating = parseFloat(item.value); //assign the checked value
    }
  }
}
//loop through pricing form and assign the value of the checked element to the request object
function assignPriceValue(tag){
  for (item of tag) {
    if (item.checked) {
      request.price_level = parseFloat(item.value); //assign the checked value
    }
  }
}
