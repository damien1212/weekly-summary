const { getDateRanges } = require('./util.js');


levelOfDetail = {
  MAX: 2,
  MID: 1,
  MIN: 0
};

lod = levelOfDetail;
exports.levelOfDetail = levelOfDetail;


class Report {
  constructor(defects, date, deferGeneration) {
    if (typeof deferGeneration === 'undefined')
      deferGeneration = false;

    this.dateRanges = getDateRanges(date);
    this.data = deferGeneration ? {} : this.generateReport();
  }

  generateReport() {}

  summarizeYear() {}

  summarizeQuarter() {}

  summarizeMonth() {}

  summarizeWeek() {}

  summarize(dateRange, detail) {}

  function summarize(dateRange, detail, group, sum, filter) {
    if (!(detail === lod.MAX || detail === lod.MID))
      detail = lod.MIN;

    let data = this.data.getDateRange(dateRange.start, dateRange.end);

    let top = [];
    if (detail === lod.MID)
      top = data.top(5, data, group, sum, filter);

    return data.reduce((acc,  row) => {
      let groupVal =  row[group].toUpperCase();
      let model =  row['MDL'];
      if (groupVal in acc) {
        if (model in acc[groupVal]) {
          acc[groupVal][model] +=  row[sum];
        } else {
          acc[groupVal][model] =  row[sum];
        }
      } else {
        acc[groupVal] = {};
        acc[groupVal][model] =  row[sum];
      }
      return acc;
    }, {});
  }
}


module.exports = {};
