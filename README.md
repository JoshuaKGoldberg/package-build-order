# package-build-order
[![Build Status](https://travis-ci.org/joshuakgoldberg/package-build-order.svg?branch=master)](https://travis-ci.org/joshuakgoldberg/package-build-order)
[![NPM version](https://badge.fury.io/js/package-build-order.svg)](http://badge.fury.io/js/package-build-order)

Determines the dependency order in which to build packages.

### Usage

`buildOrder` takes in an `Object` or `Map` linking package names to their folder or `package.json` paths.
It returns a `Promise` for the order in which the packages should be built.

For example, if `second` has a dependency on `first` in its `package.json`, the order would be `["first", "second"]`.

```javascript
import { buildOrder } from "package-build-order";
```

Passing a traditional `Object`:
```javascript
const order = await buildOrder({
    "first": "./path/to/first",
    "second": "./path/to/second"
});
```

Passing a `Map`:
```javascript
const order = await buildOrder(new Map([
    ["first", "./path/to/first"],
    ["second", "./path/to/second"]
]))
```

You can also pass direct references to `.json` files, provided they provide `"dependencies"` as an array of project names.

```javascript
const order = await buildOrder({
    "first": "./path/to/first/package.json",
    "second": "./path/to/second/custom-settings.json"
});
```
