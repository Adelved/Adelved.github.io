//fetch API key from the config file and append to the https request for the google api
var apiTag = document.getElementById("api");
fetch("/config.json")
  .then((response) => response.json())
  .then(function (config) {
    apiTag.setAttribute(
      "src",
      "https://maps.googleapis.com/maps/api/js?libraries=places&callback=createMap&key=" +
        config.apiKey
    );
  });
