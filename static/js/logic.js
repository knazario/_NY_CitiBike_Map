let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;

// Create the createMap function.
function createMap(bikeStations){
  // Create the tile layer that will be the background of our map.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object to hold the lightmap layer.
  let baseMaps = {
    'Street Map Layer': street
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options.
  let myMap = L.map("map-id", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [street, bikeStations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}
// Create the createMarkers function.
function createMarkers(response,response2){
  // Pull the "stations" property from response.data.
  let stations = response.data.stations;
  let statuses = response2.data.stations
  console.log(stations[3]);
  console.log(statuses[3]);
  // Initialize an array to hold the bike markers.
  let bikes = [];
  // Loop through the stations array.
  for (i = 0; i<stations.length; i++){
    // For each station, create a marker, and bind a popup with the station's name.
    let bike = stations[i];
    let status = statuses[i];
    let marker = L.marker([bike.lat,bike.lon])
      .bindPopup(`<h2>${bike.name}</h2> <hr> <h3>Capacity: ${bike.capacity}</h3><h3>Num Bikes Available: ${status.num_bikes_available}`);
    // Add the marker to the bikeMarkers array.
    bikes.push(marker);
  }
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  let bikeStations = L.layerGroup(bikes);
  createMap(bikeStations);
}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
const url = 'https://gbfs.citibikenyc.com/gbfs/en/station_information.json';
let url2= 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json'; //bike station status

//d3.json(url).then(createMarkers); // Alternative since all you are doing is calling the function with the data
d3.json(url).then(function(data) {
  
  d3.json(url2).then(function(data2){
    createMarkers(data,data2);
  });
});



