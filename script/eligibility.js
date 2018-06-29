// code courtesy of https://stackoverflow.com/questions/31790344/determine-if-a-point-reside-inside-a-leaflet-polygon
function isMarkerInsidePolygon(coordinates, poly) {
    var polyPoints = poly.getLatLngs();       
    var x = coordinates[0], y = coordinates[1];

    var inside = false;
    for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
        var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

// That's the end of this!  More eligibility stuff will be added later.
// Read zip code polygons from https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/in_indiana_zip_codes_geo.min.json