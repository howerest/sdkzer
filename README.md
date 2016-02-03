## Work in progress (not ready for production) ##

David Valín
  howerest Labs . http://www.howerest.com/labs

## Introduction ##
howerest sdkzer implements a dev-friendly javascript API to interact with http restful resources. You can inherit the Sdkzer functionality in your SDK entities and write your custom behavior and data on top of that layer.

The Goal is to make it compatible with ES3 and at the same time with Node.js. And also released as a compatible  Angular 1.x, Require.JS, function and Node modules too.

With howerest sdkzer you don't talk low level to your http API, you do it through a javascript API like so:

```
var like;
like = new Like();
like.userId = 10
like.produuctId = 29188
like.save
```

howerest sdkzer play nice with any framework: Angular 1.x, Angular 2, React.js... And will help you to have a model layer in your software that you can easily migrate to any javascript framework.

## Understanding models ##

If you want to know about the importance of a model in your software read Model Driven Design book.

## The reason of this ##

When you have an http restful API as your backend and you need to connect it to web frontends (browser) or connect from other javascript backends (Node.js) you need to connect via http and interact with the other data source. howerest sdkzer will allow you to not have to reinvent the wheel everytime writting this communication logic.

The idea is to create a SDK (Software Development Kit) that contains all your javascript entities mapped to your http API (your model). On top of the howerest sdkzer functionality you will implement your model methods and attributes, and you will have a rich API to interact with your http API from a simple javascript API.

## Typescript ##

This tool is coded in Typescript and your SDK is supposed to be coded in Typescript. Typescript will generate ES3/ES5 or ES6 output, depending on your needs.

You can code your sdk using howerest sdkzer in Javascript or Typescript. I recommend you Typescript since it will introduce more mainteinable code.

## 1. Implementing your sdk with howerest Sdkzer ##

Ok so let's get started! First thing you have to ask yourself is: Am I going to user Typescript or raw Javascript?

### 1.1. How to construct your sdk ###

The best thing to is wrap your sdk into a module, wether you are using Typescript or Javascript you should create a module that contain all your model instances.

Sample:

* TODO: Write

## 2. Using your sdk

### 2.1. Interact with resource collections ###


Javascript:
```
var geoPositions;

GeoPosition.fetchIndex(query).then(
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

Javascript:
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
user.fetch().then(
  // Success
  function() {
    console.log('awesome! Got the user data: ', this.attrs);
  },
  // Failure
  function() {
    console.log('')
  }
)

```
### 2.4.2. Read a record ###
```
var user = new User({ id: 19 });
user.fetch().then(
  // Success
  function(response) {
    console.log('User synced!');
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

Sample code:

```
module sdk {
 export class GeoPosition extends sdkzer.Sdkzer {
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

## Setup ##

npm install
tsd install
