import test from 'ava';
import { interpret, isIntent } from 'intention';
import { getStats, reduceStats, getStatsWithPeriod } from '../logic/npm';
import { log, getCliArgs, main } from '../logic';

const ensure = (it, eType, eValues) => (
  isIntent(it) &&
  (!eType || eType === it.type) &&
  (!eValues || Object.keys(eValues).reduce((flag, key) => flag || eValues[key] === it.values[key]))
);

test('npm:getStats', t => t.truthy(ensure(getStats('xow', 'day'), 'write:net', {
  json: true,
  url: 'https://api.npmjs.org/downloads/range/day/xow',
})));

test('npm:getStatsWithPeriod', async t => {
  const world = {
    'write:net': (_, resolve) => resolve(5),
  };
  const { stats, period } = await interpret(getStatsWithPeriod('meow', 'foo'), world);
  t.is(stats, 5);
  t.is(period, 'foo');
});

test('npm:reduceStats', t => {
  t.is(reduceStats({
    downloads: [
      { downloads: 5 },
      { downloads: 7 },
    ],
  }), 12);
  t.is(reduceStats({}), 0);
});

test('main:log', t => t.truthy(ensure(log('xow'), 'write:log')));
test('main:cli', t => t.truthy(ensure(getCliArgs(), 'read:argv')));
test('main:impure', async t => {
  const world = {
    'write:net': (params, resolve) => resolve({
      downloads: [
        { downloads: 5 },
        { downloads: 7 },
      ],
    }),
    'read:argv': (_, resolve) => resolve(['feffect']),
    'write:log': ({ args }, resolve, reject) =>
      (args[0] !== 'xow' && args[0] !== 12) ? reject() : resolve(),
  };
  await interpret(main(), world);
  world['read:argv'] = (_, resolve) => resolve([]);
  try {
    await interpret(main(), world);
    t.fail('Should fail');
  } catch (e) {
    t.pass('Failed');
  }
});
