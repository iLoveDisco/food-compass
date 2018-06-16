// database is the giant JSON list of the database

var mymap = L.map('mapid').setView([39.759135, -86.158368], 14.3);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic2FtbWlkeXNhbSIsImEiOiJjamlnb2RxMXUxN2c1M3Byd3cyNDVkOWl2In0.Is8dM6T4w7eJHydcajXhzA'
}).addTo(mymap);

var lc = L.control.locate({
  position: "topleft",
  keepCurrentZoomLevel: true,
  strings: {
    title: "Determine location"
  }
}).addTo(mymap);
lc.start();

// Stolen from https://stackoverflow.com/questions/43167417/calculate-distance-between-two-points-in-leaflet (thanks)
function toRadian(degree) {
  return degree*Math.PI/180;
}
function metersToMiles(meters) {
  return meters / 1600
}
function getDistance(origin, destination) {
  // return distance in meters
  var lon1 = toRadian(origin[1]),
      lat1 = toRadian(origin[0]),
      lon2 = toRadian(destination[1]),
      lat2 = toRadian(destination[0]);

  var deltaLat = lat2 - lat1;
  var deltaLon = lon2 - lon1;

  var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
  var c = 2 * Math.asin(Math.sqrt(a));
  var EARTH_RADIUS = 6371;
  return c * EARTH_RADIUS * 1000;
}

var provider = new window.GeoSearch.EsriProvider();

var myCoordinates = []

var markers = []
database.forEach(function (agency) {
  provider.search({ query: agency.address + ", Indianapolis, IN" }).then(function (result) {
    var marker = L.marker([result[0].y, result[0].x])
    marker.addTo(mymap)
    markers.push(marker)

    if (myCoordinates.length > 0) {
      marker.bindPopup(`<p>${Math.round(100 * metersToMiles(getDistance([marker._latlng.lat, marker._latlng.lng], myCoordinates))) / 100} miles</p>`)
    }
  })
})

function onLocationFound (e) {
  myCoordinates = []
  myCoordinates.push(e.latlng.lat)
  myCoordinates.push(e.latlng.lng)

  markers.forEach(function (m) {
    m.bindPopup(`<p>${Math.round(100 * metersToMiles(getDistance([m._latlng.lat, m._latlng.lng], [e.latlng.lat, e.latlng.lng]))) / 100} miles</p>`)
  })
}

mymap.on('locationfound', onLocationFound)
