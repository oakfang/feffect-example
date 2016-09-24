const { effect, impure, concurrent } = require('../env');
const { getStatsWithPeriod, reduceStats } = require('./npm');

const getPackageName = argv => argv[0];

const log = (...args) => effect('write:log', { args });
const getCliArgs = () => effect('read:argv');
const getStatsArray = pkg => (['day', 'week', 'month'])
  .map(p => `last-${p}`)
  .map(p => getStatsWithPeriod(pkg, p));

const main = impure(function* () {
  const argv = yield getCliArgs();
  const pkg = getPackageName(argv);
  if (!pkg) {
    throw new Error('No package provided');
  }
  const statsE = getStatsArray(pkg);
  for (const {period, stats} of (yield concurrent(statsE))) {
    yield log(`${period}: ${reduceStats(stats)}`);
  }
});

module.exports = {
  log,
  getCliArgs,
  main,
};
