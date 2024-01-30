 // Initialize the map
 let map = L.map('map').setView([0, 0], 2);

 // Add the basemap layer (you can choose other basemaps if needed)
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '© OpenStreetMap contributors'
 }).addTo(map);

 // Fetch earthquake data from the USGS API
 fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
   .then(response => response.json())
   .then(data => {
     // Loop through the earthquake data and create markers
     data.features.forEach(feature => {
       let magnitude = feature.properties.mag;
       let depth = feature.geometry.coordinates[2];

       // Define marker size based on magnitude
       let markerSize = magnitude * 4;

       // Define marker color based on depth
       let markerColor = getColor(depth);

       // Create a circle marker for each earthquake
       let marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
         radius: markerSize,
         fillColor: markerColor,
         color: '#000',
         weight: 1,
         opacity: 1,
         fillOpacity: 0.8
       }).addTo(map);

       // Add a popup with earthquake information
       marker.bindPopup(`<strong>Location:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`);

       // Add a click event to zoom in when clicking on a marker
       marker.on('click', function () {
         map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 8);
       });
     });

     // Add legend
     let legend = L.control({position: 'bottomright'});

     legend.onAdd = function (map) {
       let div = L.DomUtil.create('div', 'legend');
       let grades = [-10, 10, 30, 50, 70, 90];
       let colors = ['#00FF00', '#FFFF00', '#FF9900', '#FF3300', '#FF0000'];

       for (var i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' +
          (grades[i]) + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
       }

       return div;
     };

     legend.addTo(map);

     // Custom legend styling
     document.getElementById('legend').innerHTML = legend.getContainer().innerHTML;
     document.getElementById('legend').style.background = 'white';
     document.getElementById('legend').style.padding = '10px';
     document.getElementById('legend').style.border = '1px solid #ccc';
     document.getElementById('legend').style.borderRadius = '5px';
   });

 // Function to determine marker color based on depth
 function getColor(depth) {
  // You can customize the color scale based on your preferences
  var colors = ['#00FF00', '#FFFF00', '#FF9900', '#FF3300', '#FF0000'];
  var depthScale = 90; // Adjust this value based on the dataset

  for (var i = 0; i < colors.length; i++) {
    if (depth <= i * depthScale) {
      return colors[i];
    }
  }
  return colors[colors.length - 1];
 }