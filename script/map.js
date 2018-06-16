// database is the giant JSON list of the database (loaded in file database.js)

// Change a variable based on being on mobile.
var fontClass = "leaflet-popup-desktop"
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  fontClass = "leaflet-popup-mobile"
}

// Where we will input the list of currently open places.
var openUl = document.getElementById("nearList")

// Where the call buttons are placed.
var callBox = document.getElementById("call")

// The header that should only be displayed if we have elements.
var nearestHeader = document.getElementById("header2")

// If we should show the next marker on the map.
var showMarker = true

// The currently open markers, sorted by distance.
var currentlyOpen = []

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

// Function to display info about the near agency.
function displayInfo(e) {
  var index = e.attributes.markerindex.value

  var marker = currentlyOpen[parseInt(index, 10)]
  marker.bindPopup(infoText(marker, [marker._latlng.lat, marker._latlng.lng], myCoordinates), {className: fontClass})
  marker.openPopup()
}

function twoDecimalPlaceMileDistance (origin, destination) {
  return Math.round(100 * metersToMiles(getDistance(origin, destination))) / 100
}

var icons = {
  name: '',
  address: '<i class="fas fa-map-pin"></i>',
  phonenumber: '<i class="fas fa-phone"></i>',
  url: '<i class="fas fa-globe"></i>',
  hours: '<i class="far fa-clock"></i>',
  eligibility: 'Eligibility: ',
  intake: 'Intake Procedures: ',
  bring: 'What to Bring: ',
  desc: '<i class="fas fa-align-justify"></i>',
  dist: '<i class="fas fa-road"></i>'
}

// The text that will be put into the info box.
function conditionallyShowData (data, dataType, header, footer) {
  if (data !== "NULL") {
    var r = "";

    
    r += `${icons[dataType]} ${data}`
    

    if(dataType == "dist")
      r += ' miles'
    
    r += "<br /><br />"

    return r
  } else {
    return ""
  }
}

function infoText (marker, origin, destination) {
  var info = "<p>"

  info += conditionallyShowData(marker.agency.name,'name')
  + conditionallyShowData(marker.agency.address,'address')
  + conditionallyShowData(marker.agency.phonenumber1,'phonenumber')
  + conditionallyShowData(marker.agency.url,'url')
  + conditionallyShowData(marker.agency.service.hours,'hours', "Hours")
  + conditionallyShowData(marker.agency.service.eligibility,'eligibility', "Eligibility")
  + conditionallyShowData(marker.agency.service.intakeprocedures,'intake', "Intake procedures")
  + conditionallyShowData(marker.agency.service.whattobring,'bring', "What to bring")
  + conditionallyShowData(marker.agency.service.description,'desc', "Description")
  + conditionallyShowData(marker.distance,'dist', " miles")
  + "</p>"

  return info
}

// A function for adding stuff to the currently open list
function addToOpenList(marker) {
  currentlyOpen.push(marker)
  nearestHeader.hidden = false

  currentlyOpen.sort(function (a, b) {
    return a.distance - b.distance
  })

  if (callBox.children.length == 2) {
    callBox.removeChild(callBox.lastChild)
  }
  callBox.innerHTML += `<button type="button" class="call"><a href="tel:${marker.agency.phonenumber1}">
  <i class="fas fa-phone"></i> Call ${marker.agency.name}
</a></button>`

  var newHTML = ""
  currentlyOpen.forEach(function (a, i) {
    if (i < 3) {
      newHTML += `<li class="openagency" onclick="displayInfo(this)" markerindex="${i}">
      <p>${a.agency.name}</p>
      <p>${a.distance} miles</p></li>`
    }
  })

  openUl.innerHTML = newHTML
}

// Get the agency locations, and store them into markers
var provider = new window.GeoSearch.EsriProvider();
var myCoordinates = []
var markers = []

database.forEach(function (agency) {
  provider.search({ query: agency.address + ", Indianapolis, IN" }).then(function (result) {
    var isOpen = isAgencyOpen(agency)

    var marker = L.marker([result[0].y, result[0].x], { icon: isOpen ? blueIcon : (agency.service.hoursrange ? blackIcon : greyIcon) })
    marker.agency = agency
    marker.isOpen = isOpen
    markers.push(marker)

    // Make the marker a bit bigger.
    var origIcon = marker.options.icon
    origIcon.iconSize = [35, 50]
    marker.setIcon(origIcon)

    if (showMarker || (!showMarker && isOpen))
      marker.addTo(map)

    if (myCoordinates.length > 0) {
      marker.distance = twoDecimalPlaceMileDistance([marker._latlng.lat, marker._latlng.lng], myCoordinates)

      if (marker.isOpen && !currentlyOpen.includes(marker)) {
        addToOpenList(marker)
      }

      marker.on('click', function () {
        marker.bindPopup(infoText(marker, [marker._latlng.lat, marker._latlng.lng], myCoordinates), {className: fontClass})
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
    m.distance = twoDecimalPlaceMileDistance([m._latlng.lat, m._latlng.lng], [e.latlng.lat, e.latlng.lng], {className: fontClass})

    if (m.isOpen && !currentlyOpen.includes(m)) {
      addToOpenList(m)
    }

    m.on('click', function () {
      m.bindPopup(infoText(m, [m._latlng.lat, m._latlng.lng], [e.latlng.lat, e.latlng.lng]), {className: fontClass})
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
