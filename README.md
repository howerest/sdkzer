## sdkzer ##

<img src="https://raw.githubusercontent.com/howerest/sdkzer/master/dist/build_pass.png"  alt="build pass" />

[http://howerest.com/labs/sdkzer](http://howerest.com/labs/sdkzer)

<img src="https://raw.githubusercontent.com/howerest/sdkzer/master/sdkzer.png"  alt="sdkzer" />

# Full API docs
For a full API specification see `dist/doc/index.html`.

## Introduction ##
sdkzer implements a dev-friendly javascript API to interact with http services implemented as RESTful which implement CRUD operations: Create, Read, Update and Delete. This is an ORM-type approach in which your source of truth is a REST api instead of a database.

You create entities that extend sdkzer class and those will automatically be connected to your restful backend endpoints. A class like User will allow you to deal with your http://yourdomain.com/api/v1/users endpoint. One important point is that resources should never be implemented nested (always flatten).

If you have a RESTful (CRUD) http API, sdkzer will work out of the box allowing you to Create, Read, Update and Delete records from a javascript API that makes sense, along with multiple methods to deal with the record state.

On top of that communication layer that sdkzer does for you out of the box you will write your custom model methods and  attributes. sdkzer makes only the repetitive work for you: communicate with the backend. By providing a predictable http api in your backend we are able to easily build an SDK that knows how to talk to your backend to make any imaginable request.

sdkzer allows you to add validation rules to your entities and generate error messages automatically based on computing the validators for each attribute.

sdkzer play nice with any frontend framework as well as with Node.js and will help you to have a model layer in your software that you can easily migrate to a different javascript environment in the future if you wish.

With sdkzer you don't talk low level to your http API, you do it through a javascript API like so:

```
const like = new Like({
  userId: 10,
  productId: 29188
});

like.save() // We got a Promise
```

## The reason of this ##

After seen big amounts of spagetti code in big frontend applications, I realize that we require a way to create models in the frontend in an standard way that helps us to Create, Read, Update and Delete records easily without having to write all the logic everytime. sdkzer helps you to get rid of spagetti code by centralizing your business logic into your model layer.

## Typescript / Javascript ES6 ##

sdkzer is developed in Typescript and available as Typescript and Javascript ES6. You can extend "Sdkzer" class for each of your SDK entities and you are ready to go.

## 1. Implementing your SDK with sdkzer ##

Build an npm package exporting all your SDK entities. Each entity is a class which inherits from "Sdkzer".

To see an SDK example using sdkzer, have a look at [sdkzer-sdk-sample](https://github.com/howerest/sdkzer-sdk-sample) repository.

### Install

`yarn add sdkzer`

### Implement your SDK

Sample code. In this case we want an entity called called "Event" that will be mapped to a RESTful endpoint at "http://localhost:8000/api/v1/events" that implements the CRUD operations called.

```
import { Sdkzer } from 'sdkzer'

export interface EventFields {
  id: number | null;
  name: string,
  geo: {
    lat: number;
    lon: number;
  }
  start_date: string;
  end_date: string;
}

/**
  * Perform CRUD operations (Create, Read, Update and Delete) to deal with Events.
  * Event is mapped to "http://localhost:8000/api/v1/events" endpoint
  */
export class Event extends Sdkzer<EventFields> {
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
    // This query will merged on top of the default Event.fetchIndex()
    const indexByCityNameHttpQuery = {
      qsParams: { 'city_name': cityName }
    };

    // Always use the default fetchIndex() passing your custom HttpQuery
    // to retrieve collections. if you need to override it do it
    return Event.fetchIndex(indexByCityNameHttpQuery);
  }

  // [...]
}
```

See a more complete example at [sdkzer-sdk-sample](https://github.com/howerest/sdkzer-sdk-sample) repository.

### 1.2. Default headers

Optionally you can set default headers that will be applied to all requests (useful to send an authorization token).

```
Sdkzer.configure({
  defaultHttpHeaders: [
    { 'Auth-Token': "9a8811c02d9aeqdc12928sscua199e3e1" }
  ]
});
```

## 2. Using your SDK

You can use your SDK in the browser or Node.js environments.


### 2.1. Read (retrieve) collections from a resource ###

```
import {Event} from 'sdk';

// Retrieve an array of Event instances
const events = await Event.fetchIndexByCityName("New York");
// This function uses Event.fetchIndex(), see the class implemented before
```

## 2.2. Create / Read / Update / Delete (CRUD) ##

### 2.2.1. Create a record and save ###
```
import {Event} from 'sdk';

const myEvent = new Event({
  name: "Salsa event",
  geo: {
    lat: 52.370216,
    lon 4.895168
  },
  start_date: "2016/06/01",
  end_date: "2016/06/02"
});

await myEvent.save();
```

### 2.2.2. Read (retrieve) a record ###

##### Option A. When you have an instance already
```
import {Event} from 'sdk';

// Your instance needs an id in order to be fetched from the origin
const event = new Event({ id: 19 });
await event.fetch();
```
##### Option B. When you don't have an instance already
```
import {Event} from 'sdk';

const event = await Event.fetchOne(19); // we got an Event instance
```

### 2.2.3. Update a record ###
```
import {Event} from 'sdk';

await Event.save();
```

### 2.2.4. Delete a record ###
```
import {Event} from 'sdk';

await Event.destroy();
```

## Contribute ##

```
yarn install
yarn test --watch
```

1. Discuss your change in an issue
2. Design your solution
3. Write important test cases for every public function
4. Previous tests should pass
5. Implement your code until your tests pass
6. Once you are done, make a pull request

## Inspired from
ActiveRecord, angular-activerecord, Doctrine, Hibernate, soci
