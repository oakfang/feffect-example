const { interpret } = require('intention');
const request = require('request');
const { main } = require('./logic');
const reality = require('./reality')({
  request,
  console,
  process,
});

interpret(main(), reality);
