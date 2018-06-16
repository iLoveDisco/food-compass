/* JavaScript getMonthlyWeekday Function:
 * Written by Ian L. of Jafty.com
 *
 * Description:
 * Gets Nth weekday for given month/year. For example, it can give you the date of the first monday in January, 2017 or it could give you the third Friday of June, 1999. Can get up to the fifth weekday of any given month, but will return FALSE if there is no fifth day in the given month/year.
 *
 *
 * Parameters:
 *    n = 1-5 for first, second, third, fourth or fifth weekday of the month
 *    d = full spelled out weekday Monday-Friday
 *    m = Full spelled out month like June
 *    y = Four digit representation of the year like 2017
 *
 * Return Values:
 * returns 1-31 for the date of the queried month/year that the nth weekday falls on.
 * returns false if there isn't an nth weekday in the queried month/year
*/
function getMonthlyWeekday(n, d, m, y) {
    var targetDay, curDay = 0, i = 1, seekDay;
    if (d == "Sunday") seekDay = 0;
    if (d == "Monday") seekDay = 1;
    if (d == "Tuesday") seekDay = 2;
    if (d == "Wednesday") seekDay = 3;
    if (d == "Thursday") seekDay = 4;
    if (d == "Friday") seekDay = 5;
    if (d == "Saturday") seekDay = 6;
    while (curDay < n && i < 31) {
        targetDay = new Date(i++ + " " + m + " " + y);
        if (targetDay.getDay() == seekDay) curDay++;
    }
    if (curDay == n) {
        targetDay = targetDay.getDate();
        return targetDay;
    } else { return false; }
}//end getMonthlyWeekday JS function

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var DAYS = {
    "M": "Monday",
    "T": "Tuesday",
    "W": "Wednesday",
    "R": "Thursday",
    "F": "Friday",
    "S": "Saturday",
    "U": "Sunday",
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
}

var MONTHS = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"]

// Read the agency date range string and decide if it is open.
function isAgencyOpen(agency) {
    var open = false
    var openRange = agency.service.hoursrange
    var parts = openRange.split(",")
    var now = new Date(Date.now())

    parts.forEach(function (p) {
        var first = p.charAt(0)
        var occurrence = 0
        var day = ""
        var endStart = 1

        if (isNumeric(first)) {
            occurrence = parseInt(first, 10)
            day = DAYS[p.charAt(1)]
            endStart++
        } else {
            day = DAYS[first]
        }

        var hoursText = p.substring(endStart, p.length)
        var hours = hoursText.split("-")

        if (occurrence > 0) {
            var dayLookup = getMonthlyWeekday(occurrence, day, MONTHS[now.getMonth()], now.getFullYear())

            if (now.getDate() == dayLookup && now.getHours() + 1 >= hours[0] && now.getHours() + 1 <= hours[1]) {
                open = true
            }
        } else {
            if (now.getDay() == DAYS[day] && now.getHours() + 1 >= hours[0] && now.getHours() + 1 <= hours[1]) {
                open = true
            }
        }
    })

    return open
}