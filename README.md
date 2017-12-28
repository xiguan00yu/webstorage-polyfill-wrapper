# webstorage-polyfill-wrapper

This is a cookie-based polyfill for localStorage and sessionStorage for
browsers that don't implement localStorage or sessionStorage.

`window.localStorage` is available at `window.$localStorage` to accomodate browsers that have `storage` disabled (therefore cannot set `window.localStorage`).

- Based on https://github.com/AgentME/webstorage-polyfill
- Further Based on https://gist.github.com/jarrodirwin/0ce4c0888336b533b2c4 with numerous
bugs fixed.
