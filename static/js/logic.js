// map object and background layer

// base layer
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// topographic layer
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

// information request
// copy of first JSON entry
// {
//     "type": "FeatureCollection",
//     "metadata": {
//     "generated": 1643032163000,
//     "url": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
//     "title": "USGS All Earthquakes, Past Week",
//     "status": 200,
//     "api": "1.10.3",
//     "count": 1877
//     },
//     "features": [
//     {
//     "type": "Feature",
//     "properties": {
//     "mag": 0.72,
//     "place": "5km WSW of Idyllwild, CA",
//     "time": 1643031248770,
//     "updated": 1643031467380,
//     "tz": null,
//     "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ci39921943",
//     "detail": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/ci39921943.geojson",
//     "felt": null,
//     "cdi": null,
//     "mmi": null,
//     "alert": null,
//     "status": "reviewed",
//     "tsunami": 0,
//     "sig": 8,
//     "net": "ci",
//     "code": "39921943",
//     "ids": ",ci39921943,",
//     "sources": ",ci,",
//     "types": ",nearby-cities,origin,phase-data,scitech-link,",
//     "nst": 21,
//     "dmin": 0.0419,
//     "rms": 0.08,
//     "gap": 79,
//     "magType": "ml",
//     "type": "earthquake",
//     "title": "M 0.7 - 5km WSW of Idyllwild, CA"
//     },
//     "geometry": {
//     "type": "Point",
//     "coordinates": [
//     -116.764,
//     33.7166667,
//     15.09
//     ]
//     },
//     "id": "ci39921943"
//     },


// https://leafletjs.com/reference-1.0.3.html
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(function(data){
        // example from documentation
        // L.geoJSON(data, {
        //     style: function (feature) {
        //         return {color: feature.properties.color};
        //     }
        // }).bindPopup(function (layer) {
        //     return layer.feature.properties.description;
        // }).addTo(map);
    var quakeLayer = L.geoJson(data, {

        style: function(feature) {
          var mag = feature.properties.mag;
          if (mag >= 4.0) {
            return {
              color: "red"
            }; 
          } else if (mag >= 3.0) {
            return {
              color: "orange"
            };
          } else if (mag >= 2.0) {
            return {
              color: "yellow"
            };
          } else {
            return {
              color: "green"
            }
          }
        }, // end style function
        onEachFeature: function(feature, layer) {

            var popupText = `
            <b>Magnitude:</b> ${feature.properties.mag}
            <br>
            <b>Location:</b> ${feature.properties.place}
            `;      
            layer.bindPopup(popupText, {
              offset: L.point(0, -10)
            });
            layer.on('click', function() {
              layer.openPopup();
            });
          },
      
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
              radius: Math.round(feature.properties.mag) * 4,
              opacity: 0.75,
            });
          }, // end pointToLayer
        })// end quakeLayer
        var overlayMaps = {
            "Earthquake Markers":quakeLayer
        };
        var map = L.map('map',{
            center: [32.776665, -96.796989],
            zoom: 4,
            layers: [street,quakeLayer]
        });
        function getColor(option){
            return  option === "4 or Greater" ? "#FF0000":
                    option === "3.00-3.99" ? "#FF5733":
                    option === "2.00-2.99" ? "rgb(255, 255, 0)":
                    "#5BFF33";
        };
        var legend = L.control({
            position:"bottomright"
        });
         legend.onAdd = function() {
             var div = L.DomUtil.create("div","info legend");
             var labels = [`<strong>Magnitude:</strong>`];
             var description = ["4 or Greater","3.00-3.99","2.00-2.99","0-1.99"]
             for (var i = 0; i < description.length; i++) {

                div.innerHTML += 
                labels.push(
                    '<hr><i class="colorID" style="background:' + getColor(description[i]) + '"></i> ' +
                (description[i] ? description[i] : '+'));
    
            } // end for
            div.innerHTML = labels.join('<br>');
        return div;
         }; // end on add
        
        legend.addTo(map); 

}); // end d3 call/promise
