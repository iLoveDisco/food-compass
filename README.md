food-compass
============

Preferred way to run:

```
npm install -g simplehttpserver
simplehttpserver
```

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