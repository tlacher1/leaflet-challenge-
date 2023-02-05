// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
// Once we get a response, send the data.features object to the createFeatures function.
  createMap(data.features);
});


function createMap(earthquakeInfo) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    

// Loop through locations and markers elements
EarthquakeMarkers = earthquakeInfo.map((feature) => 
    L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
    radius: magCheck(feature.properties.mag),
    stroke: true,
    color: 'black',
    opacity: 1,
    weight: 0.5,
    fill: true,
    fillColor: magColor(feature.properties.mag),
    fillOpacity: 0.9   
})
.bindPopup("<h1> Magnitude : " + feature.properties.mag +
"</h1><hr><h3>" + feature.properties.place +
"</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
)


var earthquakes=L.layerGroup(EarthquakeMarkers)
var mags = earthquakeInfo.map((d) => magCheck(+d.properties.mag));
console.log(d3.extent(mags));
console.log(mags);

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };


  // Create our map, giving it the street and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });



  // Set up the legend.
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div","legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];

    // Looping through
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          "<i style='background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
      }
      return div;
    };
  // Adding the legend to the map
  legend.addTo(myMap);

}

 // Adding the color level to magnitude of earthquake
function magColor(mag) {
  var color = "";
  if (mag <= 2) { color = "#ffffb2"; }
  else if (mag <= 3) {color = "#fecc5c"; }
  else if (mag <= 4) { color = "#fd8d3c"; }
  else if (mag <= 5) {color = "#f03b20"; }
  else { color = "#bd0026"; }

return color;

};

function magCheck(mag){
if (mag <= 1){
  return 8
}
return mag * 8;
}
