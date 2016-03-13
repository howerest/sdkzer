## Preliminary version available (not ready for production yet) ##

David Valín
  howerest Labs . http://www.howerest.com/labs

Definitive API almost ready:
  [![Build Status](https://travis-ci.org/howerest/sdkzer.svg?branch=master)](https://travis-ci.org/howerest/sdkzer)

## Introduction ##
sdkzer implements a dev-friendly javascript API to interact with http restful resources. You create entities that extend Sdkzer class and those will automatically be connected to your restful backend endpoints. A class like User will allow you to deal with your http://yourdomain.com/api/v1/users endpoint. If you have a restful (CRUD) http api, sdkzer will work out of the box allowing you to Create, Read, Update and Delete records from a javascript API that makes sense, along with multiple methods to deal with the record state.

On top of that communication layer that sdkzer does for you out of the box you will write your custom model methods and  attributes. sdkzer makes only the repetitive work for you: communicate with the backend. This is an excelent way to standarize your backend-frontend communication. By providing a predictable http api in your backend we are able to easily build an SDK that knows how to talk to your backend to make any imaginable request.

Thanks to Typescript, sdkzer is able to be automatically exported to ES3, ES5 and ES6.

sdkzer play nice with any framework: Angular 1.x, Angular 2, React.js... And will help you to have a model layer in your software that you can easily migrate to any javascript framework.

With sdkzer you don't talk low level to your http API, you do it through a javascript API like so:

```
var like;
like = new Like();
like.userId = 10
like.produuctId = 29188
like.save() // We got a Promise
```


## Understanding models ##

If you want to know about the importance of a model in your software read please read the book Domain-Driven Design: Tackling Complexity in the Heart of Software by Eric Evans.

## The reason of this ##

After seen big amounts of spagetti code in big frontend applications, I realize that we require a way to create models in the frontend in an standard way that helps us to Create, Read, Update and Delete records easily without having to write all the logic everytime. sdkzer helps you to get rid of spagetti code, helps you to understand better your software. All data layer lives now in your SDK, not in your controllers. And this allows you also to migrate it to any framework and inject the entities of your SDK that you need in your application controllers.

The idea is to help to create a SDK (Software Development Kit) that contains all your javascript entities mapped to your http API (your model). On top of the sdkzer functionality you will implement your model methods and attributes, and you will have a rich API to interact with your http API from a simple javascript API.

## Typescript ##

sdkzer is developed in Typescript. You can extend Sdkzer class for each of your SDK entities and you are ready to go.

## 1. Implementing your sdk with sdkzer ##

Implementing an SDK with sdkzer First thing you have to ask yourself is: Am I going to user Typescript or raw Javascript?

### 1.1. How to construct your sdk ###

Wrap your SDK into a module. wether you are using Typescript or Javascript you should create a module that contain all your model instances. You can optionally create 1 module per entity as well if you have many model entities that you want to lazy load.

Sample code:

Typescript:
```
module sdk {
 // Entity definition, here GeoPosition will me mapped to your /geo-position endpoint
 export class GeoPosition extends Sdkzer {
    public resourceEndpoint() {
       return 'http://localhost:8000/api/v1/geo-position';
     }

     public defaults() {
       return { lat: null, lon: null };
     }

     public parse(data:Object) {
       return data['geo'];
     }

     public toOriginJSON() {
       return { 'geo': this.attrs };
     }
   }
}
```

## 2. Using your sdk

### 2.1. Interact with resource collections ###

```
var geoPositions;

GeoPosition.fetchIndex().then(
  // Success
  function(geoPositions) {
    geoPositions = geoPositions;
  },
  // Fail
  function(reason) {

  }
);
```

### 2.2. Creating model entity instances ###

```
var geoPosition = new geoPosition({
  lat: 52.370216,
  lon 4.895168
});

```

### 2.3. Interact with resource instances ###

Once you have a model entity instance created and assigned to a variable, you do it through instance methods:

```
geoPerson.hasChanged();
geoPerson.fetch();
geoPerson.update();
geoPerson.destroy();
...
```

## 2.4. Create / Read / Update / Delete (CRUD) ##

### 2.4.1. Create a record ###
```
var user = new User({ id: 198 });
user.save().then(
  // Success
  function() {
    console.log('awesome! Record was saved in the origin using: ', user.attrs);
  },
  // Failure
  function() {
    console.log('error saving the record in the origin');
  }
)

```
### 2.4.2. Read a record ###
```
var user = new User({ id: 19 });
user.fetch().then(
  // Success
  function(response) {
    console.log('Attributes has been updated!');
  },
  // Failure
  function(response) {
    console.log('Failed when syncing the User')
  }
)
```

### 2.4.3. Read a collection ###

```
var geoPositions;

GeoPosition.fetchIndex(qsParams).then(
  // Success
  function(geoPositions) {
    geoPositions = geoPositions;
  },
  // Fail
  function(reason) {

  }
);

// You have a collection of isolated instances containing all your instance methods
geoPositions[0].myInstanceMethod();
```

### 2.4.4. Update a record ###
```
user.update().then(
  // Success
  function(response) {
    console.log('Updated');
  },
  // Failure
  function(response) {
    console.log('Failed when updating')
  }
);
```
### 2.4.4. Delete a record ###
```
user.delete().then(
  // Success
  function(response) {
    console.log('Deleted');
  },
  // Failure
  function(response) {
    console.log('Failed when deleting')
  }
);
```

## Contribute ##

```
npm install
tsd install
karma start karma.conf
```
