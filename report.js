const { getDateRanges } = require('./util.js');


levelOfDetail = {
  MAX: 2,
  MID: 1,
  MIN: 0
};

lod = levelOfDetail;


class Report {
  constructor(defects, date, dispo, sum) {
    if (typeof deferGeneration === 'undefined')
      deferGeneration = false;

    this.data = defects;
    this.dateRanges = getDateRanges(date);
  }

  generateReport() {
    let year = this.dateRanges.year.start.year();
    let dispo = this.dispo[0] + this.dispo.slice(1).toUpperCase();
    let sum = this.sum === 'cost' ? 'Cost' : 'Defects';

    let data = {
      year: {
        sheet: `Yearly ${year}`,
        title: `Year ${year} ${dispo} ${sum}`,
        type: this.sum,
        data: {},
        quarters: []
      }
    };

    data.year.data = summarizeYear(this.dateRanges.year);

    for (let quarter of this.dateRangers.quarters) {
      let qtrS = quarter.start.quarter();
      let qtrL = quarter.start.format('Qo');
      let qtrData = {
        sheet: `Q${qtr} ${year}`,
        title: `${qtrL} Quarter ${year} ${dispo} ${sum}`,
        type: this.sum,
        data: {},
        months: []
      };

      data.year.quarters.push(qtrData);
    }
  }

  summarizeYear(year, sum) {
    return summarize(year, lod.MIN, 'plant', sum);
  }

  summarizeQuarter(qtr, sum) {
    return summarize(qtr, lod.MIN, 'partName', sum);
  }

  summarizeMonth(month, sum) {
    return summarize(month, lod.MID, 'partName', sum);
  }

  summarizeWeek(week, sum) {
    return summarize(week, lod.MAX, 'partName', sum);
  }

  summarize(dateRange, detail, group, sum, filter) {
    if (!(detail === lod.MAX || detail === lod.MID))
      detail = lod.MIN;

    let data = this.data.filterDate(dateRange.start, dateRange.end);

    let top = [];
    if (detail === lod.MID)
      top = data.top(5, group, sum, filter);

    let reducedData = data.reduce(group, sum, filter);  // Now we have sum per group

    if (detail > lod.MIN) {
      let topDatasReduced = {};
      let i = 0;

      for (let item of top) {
        if (i > top.length)
          break;

        topDatasReduced[item] = data.reduce('defect', sum, v => item === v.partNum);
        i++;
      }

      for (let entry of Object.entries(topDatasReduced)) {
        reducedData[entry[0]] = entry[1];
      }
    }

    return reducedData;
  }
}


module.exports = {
  Report,
  levelOfDetail
};
