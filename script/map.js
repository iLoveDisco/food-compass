// database is the giant JSON list of the database (loaded in file database.js)

// Where we will input the info onto the page.
var infoBox = document.getElementById("info")

// If we should show the next marker on the map.
var showMarker = true

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
function conditionallyShowData (data, header, footer) {
  if (data !== "NULL") {
    var r = "";

    if (header)
      r += `${header}: ${data}`
    else
      r += `${data}`

    if (footer)
      r += footer
    
    r += "<br />"

    return r
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
  + conditionallyShowData(marker.agency.service.hours, "Hours")
  + conditionallyShowData(marker.agency.service.eligibility, "Eligibility")
  + conditionallyShowData(marker.agency.service.intakeprocedures, "Intake procedures")
  + conditionallyShowData(marker.agency.service.whattobring, "What to bring")
  + conditionallyShowData(marker.agency.service.description, "Description")
  + conditionallyShowData(twoDecimalPlaceMileDistance(origin, destination), null, " miles")
  + "</p>"

  return info
}

// Get the agency locations, and store them into markers
var provider = new window.GeoSearch.EsriProvider();
var myCoordinates = []
var markers = []

database.forEach(function (agency) {
  provider.search({ query: agency.address + ", Indianapolis, IN" }).then(function (result) {
    var marker = L.marker([result[0].y, result[0].x])
    marker.agency = agency
    marker.isOpen = isAgencyOpen(agency)
    markers.push(marker)

    if (showMarker || (!showMarker && marker.isOpen))
      marker.addTo(map)

    if (myCoordinates.length > 0) {
      marker.on('click', function () {
        marker.bindPopup(infoText(marker, [marker._latlng.lat, marker._latlng.lng], myCoordinates))
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
      m.bindPopup(infoText(m, [m._latlng.lat, m._latlng.lng], [e.latlng.lat, e.latlng.lng]))
    })
  })
}

map.on('locationfound', onLocationFound)

// A helper to show all markers
function changeShowMarkers() {
  var checkValue = document.getElementById("showMarkers")

  showMarker = !showMarker

  if (showMarker === true) {
    markers.forEach(function (m) {
      m.addTo(map)
    })
  } else {
    markers.forEach(function (m) {
      if (!isAgencyOpen(m.agency))
        map.removeLayer(m)
    })
  }
}
