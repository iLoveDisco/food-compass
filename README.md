food-compass
============

For the Food Compass Challenge at the Indy Civic Challenge 2018, our team, Compass ProgRESs (comprising [Rohan](https://github.com/rohanvarshney), [Eric](https://github.com/iLoveDisco), and [Sam](https://github.com/Sammidysam)), developed a static web application using HTML, CSS, JavaScript, and Java (for data management), to provide a pertinent solution to the food insecurity problem that afflicts Marion County and the city of Indianapolis.

Our web application is titled ‘Food Compass’ as per the result of the library meeting, and presents the user with lists, a checkbox, and a map.
The map is focused on Indianapolis, and features pins that correlate to various local and state-based agencies that can provide resources and assistance for people with food insecurity, as per the 211 database.
These locations range from local, charities, churches, and established programs that are spread widely throughout the county.
The checkbox gives the option to hide pins that may not be relevant, effectively filtering agencies that are not immediately relevant, open, or accessible to the user.
The list provides a list of agencies that are both open and accessible to the user (with certain considerations).
The app was designed with mobile in mind, but with respect to desktop.

The pins themselves on the map provide a myriad of information upon clicking: the name of the agency, its address, phone number, website URL, distance, and relevant information regarding procedures and requirements.
In order to process this, a database had to be created from Food_Panty_ExcelExport.xls, provided in “https://indychamber.com/hack/“.
In order to manipulate it, we modified columns of data that were redundant, exported the spreadsheet into a CSV (Comma Separated Values) file, then read them into Java.
We created Agency and Service classes to read the csv file and store it into an ArrayList.

We then created a method that would be able to print out this database into a JavaScript file that would be used as the official database for our website to use. 

map.js uses Leaflet, an open source JavaScrip library for map manipulation as well as the OpenStreetMap data.
It allows us to create a map frame that shows our current location, and offers maneuverability of the map itself.
A function was created so that the time range for the agency’s opening hours could be read in by JavaScript, which required hand-coding it into the database according to the format (f.e. the third Tuesday every month from 6pm to 9pm = “3T18-21”).

The JavaScript database is then read into map.js to plot the locations of the agencies (done through an add-on called Leaflet.locateControl) and its  corresponding information in the pop-up.

============

Preferred way to run:

```
npm install -g simplehttpserver
simplehttpserver
```

Why?
Esri gets upset at our geolocating commands when we do not run a server.

Database structure:

Each item that does not have "(opt)" at the end is required.
(It will be "NULL" if we do not have the data)
An "(opt)" item can not exist in the database if we do not have it.

```
Agency
  id:string
  name:string
  address:string
  zip:string
  url:string
  phonenumber1:string
  phonenumber2:string
  service
    description:string
    hours:string
    hoursrange:string (opt)
    eligibility:string
    intakeprocedures:string
    whattobring:string
    servicearea:string
```

Hours format:

This is the format for the `service.hoursrange` variable.
It follows a defined language to determine which ranges are acceptable.

```
M=Monday
T=Tuesday
W=Wednesday
R=Thursday
F=Friday
S=Saturday
U=Sunday

examples:
3T10-12 = every third Tuesday of the month from 10-12
3T18-20 = every third Tuesday of the month from 6-8 PM
```

============

This project was completed in 22 hours for the Indy Civic Hackathon Food Compass challenge.

The next steps in the development process for the web application would be less feature-based and focused primarily on sustainability.
For example, storing the database externally rather than local to the file.

Many of the minor issues that were encountered regarded data cleaning and initial set-up of the map plot.
The Food_Panty_ExcelExport.xls sheet was not organized in a standardized way or in a format convenient for data manipulation.
If the file contained commas already, then exporting the spreadsheet to a CSV file would cause problems.
Also, in order for our java file to read the csv file  into the database, it read line by line but some cells within the spreadsheet had multiple lines of its own that caused unforeseen issues.
Much time was spent formatting this information for appropriate exporting while other teammates concurrently had to overcome a learning curve with the new JavaScript libraries.

Though our application currently uses a database from one spreadsheet, our plots on the app show that only a specific set of information is required from each agency to be viable on the application.
Therefore, adding information to our database would be simple if the agency’s information was given in a compatible format (name in all caps, hours in the specified format, phone number, URL, address, etc.). Therefore, we would be able to expand our web application to include other agencies easily as adding to our database could easily be done manually or with a Java GUI app that could go into the JavaScript database file itself to add the agency’s information.
This could also allow currently existing agencies within the database to be modified should phone numbers, details, and other values change, especially for the agencies whose hours are undeclared or set to NULL.

CSS formatting was also tedious as using the Leaflet library for the map caused some nuances in basic groundwork framing as well as accounting for the differences that occur within multiple internet platforms (Chrome, Safari, IE) on both laptops and phones.
If given more time, we could fine-tune the design for each of the respective platforms. 

Many ideas for features that could be helpful came as possibilities but had to be written off due to time constraints.
Some examples include: a search bar to find specific agencies and programs, a hypothetical search for what is open at specific times and dates (What programs are available on Friday at 6pm?), URLs for the phone numbers and addresses within the pins, and more.
If given time, we believe these are very helpful features that could benefit the reliability and value of the web application. 

============

This was the first hackathon of any type for every member of the team.
Some of us felt initial feelings of self-doubt, that our knowledge may not be enough to provide significant help and that our lack of hackathon experience may leave us handicapped in creative potential.
However, our team ended up utilizing all of our skills to the best use.
Sam had the most experience with JavaScript and was best able to utilize the Leaflet libraries to create the map script.
Rohan knew Java and was able to provide most of the framework of the Java files that would create the database from the spreadsheet.
Eric is a connoisseur of languages, who knew HTML and CSS the best and was able to handle design and formatting as well as logos while simultaneously pair programming with Rohan and Sam intermittently. 

The team was formed spontaneously but ended up being a strongly functioning team where each member could work on their strengths to create the final product, with Sam on deciphering, Eric on design, and Rohan on documentation, while also engaging in collaboration for issues that didn’t play to a single person’s strength (data mining, feature blueprint, etc.).

Ultimately, the hackathon and its challenges were able to form an environment that produced a team that was ready to rise up to the occasion.
Optimistically, we believed that we produced a product that may provide a viable way to aid the ailment of food insecurity in Indianapolis.
At worst, we were able to gain a lot of experience at our first hackathon, made some new friends, and are grateful for the opportunity to both be a part of this event and show support for the Indianapolis community at large.
