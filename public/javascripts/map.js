var addresses = `1400 North Meridian Street
2801 West Washington Street
445 North State Avenue
701 North Delaware Street
2020 North Girls School Road
1535 Dr. Andrew J. Brown Avenue
6601 North Grandview Drive
802 Edgemont Avenue
4424 East Michigan Street
8540 US Highway 31 South
8946 Southeastern Avenue
1733 East 46th Street
1525 North Ritter Avenue
4400 North High School Road
1337 South Shelby Street
3312 East English Avenue
5062 Pike Plaza Road
2830 South Holt Road
5943 Lafayette Road
47 Beachway Drive
1901 North Harding Street
111 South Downey Avenue
2700 North College Avenue
963 North Girls School Road
964 North Pennsylvania Street
4501 North Post Road
2990 West 71st Street
431 South Shortridge Road
4062 East 34th Street
6185 Guilford Avenue
1920 West Morris Street
5625 West 30th Street
4501 West 38th Street
2900 East 62nd Street
3909 North Meridian Street, Suite 100
2605 East 25th Street
5602 Elmwood Avenue, Suite 212
1634 East Minnesota Street
952 North Pennsylvania Street
1224 Laurel Street
1347 North Meridian Street
40 West 40th Street, Suite 223
6701 Oaklandon Road
1215 Tecumseh Street
9101 West 10th Street
3333 North Meridian Street
1637 East Prospect Street
2416 East 55th Place
3025 West 69th Street
6940 North Michigan Road
7700 North Meridian Street
930 Prospect Street
8600 Meadowlark Drive
3445 West 71st Street
5750 East 30th Street
7101 Pendleton Pike
4007 North Sherman Drive
3737 Waldemere Avenue
3021 East 71st Street
4040 East Thompson Road
1610 East 19th Street
24 South Lynhurst Drive
8610 West 10th Street
2624 East 25th Street
1801 East 49th Street
1003 West 16th Street
530 South Taft Avenue
9401 East 25th Street
4088 Millersville Road
900 West 30th Street
5330 East 38th Street
4501 Fletcher Avenue
2325 Hovey Street
2056 East 32nd Street
3709 North Shadeland Avenue
3132 Carson Avenue
9039 West Washington Street
2846 Cold Spring Road
10302 East 38th Street
70 North Mount Street
1416 East Epler Avenue
4550 Central Avenue
8032 East 21st Street
5840 East 16th Street
1754 West Morris Street
116 South Muessing Street
3740 South Dearborn Street
1061 East Southern Avenue
4107 East Washington Street
3801 Forest Manor Avenue
29 North Grant Avenue
1701 Dr. Andrew J. Brown Avenue
3326 West 10th Street
2809 East 56th Street
9610 East 42nd Street
3001 East 30th Street
8600 North College Avenue
303 North Elder Avenue
2253 Dr. Andrew J. Brown Avenue
2601 East Thompson Road
5901 Lafayette Road`

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
var arrayOfLines = addresses.match(/[^\r\n]+/g);
arrayOfLines.forEach(function (address) {
  provider.search({ query: address + ", Indianapolis, IN" }).then(function (result) {
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
