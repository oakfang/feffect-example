const { run } = require('./env');
const { main } = require('./logic');
const world = require('./world');

run(main(), world);
