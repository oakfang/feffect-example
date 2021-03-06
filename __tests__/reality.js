import test from 'ava';

const stubs = {
  request(options, cb) {
    switch (options) {
      case 'foo': return cb(1);
      case 'bar': return cb(null, { statusCode: 400, x: 2 });
      case 'buzz': return cb(null, { statusCode: 200 }, 3);
    }
  },

  console: {
    log(...args) {
      return args[0];
    },
  },
  process: {
    argv: [1, 2, 3, 4],
  },
};

const reality = require('../reality')(stubs);

const interpret = (interpretation, params) => new Promise((resolve, reject) =>
  interpretation(params, resolve, reject));

test('write:net', async t => {
  try {
    await interpret(reality['write:net'], 'foo');
    t.fail('Should fail');
  } catch (e) {
    t.is(e, 1);
  }

  try {
    await interpret(reality['write:net'], 'bar');
    t.fail('Should fail');
  } catch (e) {
    t.is(e.x, 2);
  }

  t.is(await interpret(reality['write:net'], 'buzz'), 3);
});

test('write:log', t => {
  reality['write:log']({ args: [2] }, x => t.is(x, 2));
});

test('read:argv', t => {
  reality['read:argv'](null, arr => {
    t.is(arr.length, 2);
    t.is(arr[0], 3);
    t.is(arr[1], 4);
  });
});
