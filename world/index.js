// For require's sake
let request = require('request');

module.exports = {
  'write:net': (options, resolve, reject) =>
    request(options, (err, response, data) => {
      if (err) throw err;
      if (response.statusCode >= 400) return reject(response);
      return resolve(data);
    }),
  'write:log': ({ args }, resolve) => resolve(console.log(...args)),
  'read:argv': (_, resolve) => resolve(process.argv.slice(2)),
};
