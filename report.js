const { getDateRanges } = require('./util.js');


levelOfDetail = {
  MAX: 2,
  MID: 1,
  MIN: 0
};

lod = levelOfDetail;


class Report {
  constructor(defects, date, deferGeneration) {
    if (typeof deferGeneration === 'undefined')
      deferGeneration = false;

    this.dateRanges = getDateRanges(date);
    this.data = defects  //deferGeneration ? {} : this.generateReport();
  }

  generateReport() {}

  summarizeYear() {}

  summarizeQuarter() {}

  summarizeMonth() {}

  summarizeWeek() {}

  summarize(dateRange, detail, group, sum, filter) {
    if (!(detail === lod.MAX || detail === lod.MID))
      detail = lod.MIN;

    let data = this.data.filterDate(dateRange.start, dateRange.end);

    let top = [];
    if (detail === lod.MID)
      top = data.top(5, group, sum, filter);

    let reducedData = data.reduce(group, sum, filter);  // Now we have sum per group

    if (top) {
      let topDatasReduced = {};

      for (let item of top) {
        topDatasReduced[item] = data.reduce('defect', sum, v => item === v.partNum);
      }

      console.log(topDatasReduced);
    }
  }
}


module.exports = {
  Report,
  levelOfDetail
};
