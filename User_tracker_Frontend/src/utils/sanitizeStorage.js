/**
 * Automatically sanitizes localStorage and sessionStorage to prevent
 * "SyntaxError: 'undefined' is not valid JSON" crashes.
 */
(() => {
  try {
    if (typeof window === "undefined" || !window.Storage) return;

    // Clean existing corrupted keys in localStorage & sessionStorage
    [window.localStorage, window.sessionStorage].forEach((storage) => {
      if (!storage) return;
      try {
        const toRemove = [];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key) {
            const val = storage.getItem(key);
            if (val === "undefined" || val === "null") {
              toRemove.push(key);
            }
          }
        }
        toRemove.forEach((k) => storage.removeItem(k));
      } catch (err) {
        // ignore
      }
    });

    // Patch getItem so literal "undefined" string is never returned (which crashes JSON.parse)
    const origGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      const val = origGetItem.call(this, key);
      if (val === "undefined") {
        return null;
      }
      if (key === "token" && typeof val === "string" && val.startsWith('"') && val.endsWith('"') && val.length > 2) {
        try {
          return JSON.parse(val);
        } catch (e) {
          return val.slice(1, -1);
        }
      }
      return val;
    };

    // Patch setItem so literal "undefined" is never stored
    const origSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, val) {
      if (val === undefined || val === "undefined") {
        return this.removeItem(key);
      }
      return origSetItem.call(this, key, val);
    };
  } catch (e) {
    // Ignore storage errors (e.g. security / private browsing)
  }
})();
