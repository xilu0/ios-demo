
export function enableNetworkInspector() {
  global._fetch = fetch;
  global.fetch = function(uri, options, ...args) {
    return global._fetch(uri, options, ...args).then((response) => {
      console.log("Fetch", { request: { uri, options, ...args }, response });
      return response;
    });
  };
}