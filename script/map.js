// database is the giant JSON list of the database (loaded in file database.js)

// Where we will input the info onto the page.
var infoBox = document.getElementById("info")

// Create the map display.
var map = L.map('map').setView([39.759135, -86.158368], 14.3)
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic2FtbWlkeXNhbSIsImEiOiJjamlnb2RxMXUxN2c1M3Byd3cyNDVkOWl2In0.Is8dM6T4w7eJHydcajXhzA'
}).addTo(map);

// Locate the user.
var lc = L.control.locate({
  position: "topleft",
  keepCurrentZoomLevel: true,
  strings: {
    title: "Determine location"
  }
}).addTo(map);
lc.start();

// Stolen from https://stackoverflow.com/questions/43167417/calculate-distance-between-two-points-in-leaflet
// These calculate various distances between coordinates
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

function twoDecimalPlaceMileDistance (origin, destination) {
  return Math.round(100 * metersToMiles(getDistance(origin, destination))) / 100
}

// The text that will be put into the info box.
function conditionallyShowData (data) {
  if (data !== "NULL") {
    return `${data}<br />`
  } else {
    return ""
  }
}

function infoText (marker, origin, destination) {
  var info = "<p>"

  info += conditionallyShowData(marker.agency.name)
  + conditionallyShowData(marker.agency.address)
  + conditionallyShowData(marker.agency.phonenumber1)
  + conditionallyShowData(marker.agency.url)
  + conditionallyShowData(marker.agency.service.hours)
  + conditionallyShowData(marker.agency.service.eligibility)
  + conditionallyShowData(marker.agency.service.intakeprocedures)
  + conditionallyShowData(marker.agency.service.whattobring)
  + conditionallyShowData(marker.agency.service.description)
  + conditionallyShowData(twoDecimalPlaceMileDistance(origin, destination))
  + "</p>"

  return info

  return `<p>
  ${marker.agency.name}<br />
  ${marker.agency.address}<br />
  ${marker.agency.phonenumber1}<br />
  ${marker.agency.url}<br />
  Hours: ${marker.agency.service.hours}<br />
  Eligibility: ${marker.agency.service.eligibility}<br />
  Intake procedures: ${marker.agency.service.intakeprocedures}<br />
  What to bring: ${marker.agency.service.whattobring}<br />
  Description: ${marker.agency.service.description}<br />
  ${twoDecimalPlaceMileDistance(origin, destination)} miles
  </p>`
}

// Get the agency locations, and store them into markers
var provider = new window.GeoSearch.EsriProvider();
var myCoordinates = []
var markers = []

database.forEach(function (agency) {
  provider.search({ query: agency.address + ", Indianapolis, IN" }).then(function (result) {
    var marker = L.marker([result[0].y, result[0].x])
    marker.addTo(map)
    marker.agency = agency
    markers.push(marker)

    if (myCoordinates.length > 0) {
      marker.on('click', function () {
        infoBox.innerHTML = infoText(marker, [marker._latlng.lat, marker._latlng.lng], myCoordinates)
        window.scrollTo(0, 0)
      })
    }
  })
})

// When we find our location, store information in the markers
// and store our location
function onLocationFound (e) {
  myCoordinates = []
  myCoordinates.push(e.latlng.lat)
  myCoordinates.push(e.latlng.lng)

  markers.forEach(function (m) {
    m.on('click', function () {
      infoBox.innerHTML = infoText(m, [m._latlng.lat, m._latlng.lng], [e.latlng.lat, e.latlng.lng])
      window.scrollTo(0, 0)
    })
  })

  console.log(markers.length)
}

map.on('locationfound', onLocationFound)
