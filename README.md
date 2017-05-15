# package-build-order
[![Build Status](https://travis-ci.org/JoshuaKGoldberg/package-build-order.svg?branch=master)](https://travis-ci.org/joshuakgoldberg/package-build-order)
[![NPM version](https://badge.fury.io/js/package-build-order.svg)](http://badge.fury.io/js/package-build-order)

Determines the dependency order in which to build packages.

### Usage

* Use `buildOrder` to get a single `string[]` of builds in series.
* Use `getBuildTracker` to get a tracker that tracks which packages become available to build when others complete.

#### `buildOrder`

`buildOrder` takes in settings object providing an `Object` or `Map` member named `paths` linking package names to their folder or `package.json` paths.
It returns a `Promise` for the order in which the packages should be built.

For example, if `second` has a dependency on `first` in its `package.json`, the order would be `["first", "second"]`.

```javascript
import { buildOrder } from "package-build-order";
```

Passing a traditional `Object`:
```javascript
const order = await buildOrder({
    paths: {
        first: "./path/to/first",
        second: "./path/to/second"
    }
});
```

Passing a `Map`:
```javascript
const order = await buildOrder({
    paths: new Map([
        ["first", "./path/to/first"],
        ["second", "./path/to/second"]
    ]
}))
```

#### `getBuildTracker`

`buildOrder` takes in settings object providing an `Object` or `Map` member named `paths` linking package names to their folder or `package.json` paths.
It returns a `Promise` for a tracker object with two methods:

* `getAvailablePackages` - Returns a `string[]` with all packages that are able to build.
* `markCompleted` - Marks a package as completed and returns a `string[]` of any packages that are now available to build.

If `markCompleted` returns an empty `[]`, that indicates all possible packages have been completed.

```typescript
import { getBuildTracker } from "package-build-order";

const tracker = getBuildTracker({
    paths: {
        first: "./path/to/first", // dependencies: []
        second: "./path/to/second" // dependencies: ["first"]
    }
});

tracker.getAvailablePackages(); // ["first"]
tracker.markCompleted("first"); // ["second"]
tracker.getAvailablePackages(); // ["first", "second"]
```

### Settings

You can also pass direct references to `.json` files, provided they provide `"dependencies"` as an array of project names.

```javascript
const order = await buildOrder({
    paths: {
        first: "./path/to/first/package.json",
        second: "./path/to/second/custom-settings.json"
    }
});
```

*Requires Node >= 7*
