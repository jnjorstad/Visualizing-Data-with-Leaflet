

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function popUpMsg(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + feature.geometry.coordinates[2] +
      "</h3><hr><p>" + new Date(feature.properties.time) +"</p>");
  }

// Change size and color
function circleSize(feature){
  radius = feature.properties.mag
  return radius*5;
}

function circleColor(feature){
  // console.log("feature",feature,typeof(feature))

  // Add an if statment to return objects only

  depth = feature.geometry.coordinates[2]
  if(depth < 5){
    color = "#ffff66"
  }
  else if (depth < 10){
    color = "#ff9933"
  }
  else if (depth < 20){
    color = "#ff0000"
  }
  else {
    color = "#800000"
  }
  return color
 }




 // Define streetmap and darkmap layers
 let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    maxZoom: 18
  });

  // Define a baseMaps object to hold our base layers
  let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };
  
// Create our map, giving it the streetmap and earthquakes layers to display on load
let myMap = L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5,
    layers: [streetmap]     //default selected layer
    });

streetmap.addTo(myMap);



// create layer; will attach data later on
let earthquakes = new L.LayerGroup();
// Alternate method below and same as above
// let earthquakes = L.layerGroup();

// Create overlay object to hold our overlay layer
let overlayMaps = {
  Earthquakes: earthquakes
};

// Create a layer control
// Pass in our baseMaps and overlayMaps
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);


const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    onEachFeature: popUpMsg, 
    pointToLayer: function(feature, latlong){
      return new L.CircleMarker(latlong, {
          radius: circleSize(feature),
          fillOpacity: 0.7
      })
  },
  style: function(feature){
    return {color: circleColor(feature)}
  }  

  }).addTo(earthquakes);

  

  earthquakes.addTo(myMap);
});

// create legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function() {
  // code for legend
  var div = L.DomUtil.create ('div', 'legend')

  // define separation of color
  var grades = [-10, 20, 50, 90];
  var colors = [
    "#ffff66",
    "#ff9933",
    "#ff0000",
    "#800000"

  ];


  // for loop to render color schema
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += `<i style = 'background:${colors[i]}' ></i>
      ${grades[i]} ${grades[i + 1]  ? `&ndash; ${grades[i + 1]} <br> ` : "+"}`;

  }
  return div;

};

legend.addTo(myMap);



