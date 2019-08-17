const withOffline = require("next-offline")
const crypto = require("crypto");

const nextConfig = {
  target: "serverless",
  transformManifest: manifest => {
    console.log(manifest)
    return [{
      url: "/",
      revision: crypto.createHash("md5").update(String(Date.now()), "utf8").digest("hex")
    }].concat(manifest)
},
  workboxOpts: {
    swDest: "static/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /service-worker\.js$/,
        handler: "NetworkOnly",
      },{
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "https-calls",
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },

}

module.exports = withOffline(nextConfig)