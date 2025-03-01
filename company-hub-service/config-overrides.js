module.exports = function override(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "fs": false,
      "path": false,
      "util": false,
      "crypto": false,
      "stream": false,
      "buffer": false,
      "os": false,
      "tls": false,
      "net": false,
      "url": false
    };
    return config;
  };