food-compass
============

Preferred way to run:

```
npm install -g simplehttpserver
simplehttpserver
```

Database structure:

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
    eligibility:string
    intakeprocedures:string
    whattobring:string
    servicearea:string
```

Hours format:

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