var BgSattelite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");
var BgOutdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");
var BgGray = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");
var map = L.map("mapid", {
  zoom: 6,
  layers: [BgGray, BgSattelite, BgOutdoors],
  center: [37.2, -96.85]
});
var Plates_Tectonic = new L.LayerGroup();
var Eqs = new L.LayerGroup();
var MapsBase = {
  Satellite: BgSattelite,
  Grayscale: BgGray,
  Outdoors: BgOutdoors
};
var MapsOverlay = {
  "Earthquakes": Eqs,
  "Tectonic Plates": Plates_Tectonic
};
BgGray.addTo(map);
L
  .control
  .layers(MapsBase, MapsOverlay)
  .addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(d) {
  function ColorMag(magnitude) {
    if (magnitude < 1) {
      return "#ccff33";
    }
    else if (magnitude < 2) {
      return "#ffff33";
    }
    else if (magnitude < 3) {
      return "#ffcc33";
    }
    else if (magnitude < 4) {
      return "#ff9933";
    }
    else if (magnitude < 5) {
      return "#ff6633";
    }
    else {
      return "#ff3333";
    }
  }
  function StyleFormat(FT) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: ColorMag(FT.properties.mag),
      color: "#000000",
      radius: ReturnRadius(FT.properties.mag),
      stroke: true,
      weight: 0.8
    };
  }
  function ReturnRadius(MG) {
    if (MG === 0) {
      return 1;
    }
    else return MG * 3;
  }

  L.geoJson(d, {
    pointToLayer: function(FT, Latitude_Longitude) {
      return L.circleMarker(Latitude_Longitude);
    },
    style: StyleFormat,
    onEachFeature: function(FT, layer) {
      layer.bindPopup("Magnitude: " + FT.properties.mag + "<br>Location: " + FT.properties.place);
    }

  }).addTo(Eqs);
  Eqs.addTo(map);
  var MapLegend = L.control({
    position: "bottomright"
  });
  MapLegend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");
    var ColorMagnitues = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];
    var GradeArray = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i < GradeArray.length; i++) {
      div.innerHTML += "<i style='background: " + ColorMagnitues[i] + "'></i> " +
        GradeArray[i] + (GradeArray[i + 1] ? "&ndash;" + GradeArray[i + 1] + "<br>" : "+");
    }
    return div;
  };
  MapLegend.addTo(map);
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(pltData) {
      L.geoJson(pltData, {
        color: "red",
        weight: 4.5
      })
      .addTo(Plates_Tectonic);
      Plates_Tectonic.addTo(map);
    });
});