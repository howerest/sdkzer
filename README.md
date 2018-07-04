## 1.6.0 Release candidate available ##

[![Build Status](https://travis-ci.org/howerest/sdkzer.svg?branch=master)](https://travis-ci.org/howerest/sdkzer)

# Full API docs
Current v1.6.0 - [Read full API docs](http://www.howerest.com/sdkzer/docs/1.6.0/classes/_howerest_sdkzer_.sdkzer.html)

## Introduction ##
sdkzer implements a dev-friendly javascript API to interact with http services implemented as RESTful which implement CRUD operations: Create, Read, Update and Delete. You create entities that extend Sdkzer class and those will automatically be connected to your restful backend endpoints. A class like User will allow you to deal with your http://yourdomain.com/api/v1/users endpoint.

If you have a RESTful (CRUD) http API, sdkzer will work out of the box allowing you to Create, Read, Update and Delete records from a javascript API that makes sense, along with multiple methods to deal with the record state.

On top of that communication layer that sdkzer does for you out of the box you will write your custom model methods and  attributes. sdkzer makes only the repetitive work for you: communicate with the backend. This is an excelent way to standarize your backend-frontend communication. By providing a predictable http api in your backend we are able to easily build an SDK that knows how to talk to your backend to make any imaginable request.

Thanks to Typescript, sdkzer is able to be automatically exported to ES3, ES5 and ES6.

sdkzer play nice with any framework: Angular 1.x, Angular 2, Riot, React.js... And will help you to have a model layer in your software that you can easily migrate to any javascript framework.

With sdkzer you don't talk low level to your http API, you do it through a javascript API like so:

```
let like = new Like({
  userId: 10,
  productId: 29188
});

like.save() // We got a Promise
```

## Understanding models ##

If you want to know about the importance of a model in your software take a look at this book: Domain-Driven Design: Tackling Complexity in the Heart of Software by Eric Evans.

## The reason of this ##

After seen big amounts of spagetti code in big frontend applications, I realize that we require a way to create models in the frontend in an standard way that helps us to Create, Read, Update and Delete records easily without having to write all the logic everytime. sdkzer helps you to get rid of spagetti code by centralizing your business logic into your model layer.

This is inspired in "[angular-activerecord](https://github.com/bfanger/angular-activerecord)". I've being loving angular-activerecord but it was depending on Angular 1.x code, this didn't fix my requirement of cross-framework and environment. A deeper layer of objects (without dependencies) to handle XHR, HttpRequest, HttpResponse, HttpQuery... was a potential improvement.

The use of TypeScript would help to organize the code, the tests, and understand it better.

Finally I separated those low level classes into WebServices. Sdkzer is on top of WebServices, helping to build models around CRUD operations.

## Typescript ##

sdkzer is developed in Typescript. You can extend Sdkzer class for each of your SDK entities and you are ready to go.

## 1. Implementing your SDK with sdkzer ##

- Setup TypeScript compiler

### 1.1. How to construct your SDK ###

Wrap your SDK into a module that contain all your model instances. You can optionally create 1 module per entity as well if you have many model entities that you want to lazy load.

To see an SDK example using sdkzer, have a look at [sdkzer-sdk-sample](https://github.com/howerest/sdkzer-sdk-sample) repository.

### Install Sdkzer and js-webservices in your SDK repository

`yarn add sdkzer js-webservices --save`

### Import Sdkzer and js-webservices in your SDK

`import { Sdkzer } from 'sdkzer'`
`import { WebServices } from 'js-webservices'`

#### Sample code. In this case we want a model called Event that will be mapped to a RESTful endpoint that implements the CRUD operations called "http://localhost:8000/api/v1/events".

Typescript:
```
import { Sdkzer } from 'sdkzer'
import { WebServices } from 'js-webservices'

export module SDK {
 /**
  * Perform CRUD operations (Create, Read, Update and Delete) to deal with Events
  * Event is mapped to "http://localhost:8000/api/v1/events" endpoint
  */
 export class Event extends Sdkzer {
    public baseEndpoint() {
       return "http://localhost:8000/api/v1/events";
     }

     public defaults() {
       return {
         name: null,
         geo: {
           lat: null,
           lon: null
         },
         start_date: null,
         end_date: null
       };
     }

     /*
      * This parses the data received from the origin endpoint
      */
     public $parse(data:Object) {
       return data['event'];
     }

     /*
      * This converts local state into data understandable by the origin endpoint
      */
     public toOriginJSON() {
       return { 'event': this.attr() };
     }

     /*
      * Your instance methods hold your business logic
      */
     public isHappening() {
       return (this.attr("start_date") === new Date().toISOString().slice(0, 10));
     }

     public howLongAgo() {
       // ...
     }

     // [...]

     /*
      * Your static methods to retrieve collections
      */
      public static fetchIndexByCityName(cityName) {
        // This query will merged on top of the default Event.fetchIndex() HttpQuery
        var indexByCityNameHttpQuery = new WebServices.HttpQuery({
            qsParams: {
              'city_name': cityName
            }
        });

        // Always use the default fetchIndex() passing your custom HttpQuery
        // to retrieve collections. if you need to override it do it
        return Event.fetchIndex(indexByCityNameHttpQuery);
      }
     // [...]
   }
}
```

### 1.2. Default headers

You can set default headers that will be applied to all requests.
Useful to send an authorization token. Http headers travel encrypted only through https.

```
Sdkzer.configure({
  defaultHttpHeaders: [
    { 'Auth-Token': "9a8811c02d9aeqdc12928sscua199e3e1" }
  ]
});
```

## 2. Using your SDK

You can use your an sdkzer SDK in the browser or Node.js environments.


### 2.1. Read (retrieve) collections from a resource ###

```
import * as SDK from 'my-sdkzer-sdk';

var events;

SDK.Event.fetchIndexByCityName("New York").then(
  // Success
  function(eventInstances) {
    events = eventInstances;
  },
  // Fail
  function() { }
);
```

## 2.2. Create / Read / Update / Delete (CRUD) ##

### 2.2.1. Create a record and save ###
```
import * as SDK from 'my-sdkzer-sdk';

var myEvent = new SDK.EventEvent({
  name: "Salsa event",
  geo: {
    lat: 52.370216,
    lon 4.895168
  },
  start_date: "2016/06/01",
  end_date: "2016/06/02"
});

myEvent.update();
```

### 2.2.2. Read (retrieve) a record ###

##### Option A. When you have an instance already
```
import * as SDK from 'my-sdkzer-sdk';

// Your instance needs an id in order to be fetched from the origin
var event = new SDK.Event({ id: 19 });
// [...]
event.fetch().then(
  function(response) { console.log('Attributes has been updated!'); },
  function() { console.log('Failed when fetching the User') }
);
```
##### Option B. When you don't have an instance already
```
import * as SDK from 'my-sdkzer-sdk';

var event;
SDK.Event.fetchOne(19).then(
  function(eventInstance) { event = eventInstance },
  function(response) { console.log('Failed when syncing the Event') }
);
```

### 2.2.3. Update a record ###
```
import * as SDK from 'my-sdkzer-sdk';

event.update().then(
  function(response) { console.log('Updated'); },
  function() { console.log('Failed when updating'); }
);
```

### 2.2.4. Delete a record ###
```
import * as SDK from 'my-sdkzer-sdk';

event.destroy().then(
  function(response) { console.log('Deleted'); },
  function() { console.log('Failed when deleting') }
);
```

#### Next steps

- Write about integration with Angular 2
- Write about integration with Angular 1.x
- Write about integration with Riot.js
- Make easier integration with non RESTful services

## Contribute ##

```
yarn install
yarn test --watch
```

1. Write important test cases for every public function
2. Previous tests should pass
3. Implement your code until your tests pass
4. Once you are done, make a pull request

## Inspired from
ActiveRecord, angular-activerecord, Doctrine, Hibernate, soci
