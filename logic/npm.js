const { intent, impure } = require('intention');

const sanitisePackage = package => package.replace(/\//g, '%2F');
const getStats = (package, period) => intent('write:net', {
  url: `https://api.npmjs.org/downloads/range/${period}/${sanitisePackage(package)}`,
  json: true,
});

module.exports.getStats = getStats;

module.exports.getStatsWithPeriod = impure(function* (package, period) {
  const stats = yield getStats(package, period);
  return { stats, period };
});

module.exports.reduceStats = ({ downloads }) =>
  (downloads || []).reduce((sum, day) => sum + day.downloads, 0);
