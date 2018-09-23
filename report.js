const { getDateRanges } = require('./util.js');


levelOfDetail = {
  MAX: 2,
  MID: 1,
  MIN: 0
};

lod = levelOfDetail;


class Report {
  constructor(defects, date, dispo, sum, filter) {
    this.data = defects;
    this.dateRanges = getDateRanges(date);
    this.dispo = dispo;
    this.sum = sum;

    if (typeof filter === 'function') {
      this._originalFilter = filter;
      this.filter = row => row.disposition === this.dispo && this._originalFilter();
    } else {
      this.filter = row => row.disposition === this.dispo;
    }
  }

  generateReport() {
    let year = this.dateRanges.year.start.year();
    let dispo = this.dispo[0] + this.dispo.slice(1).toLowerCase();
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

    data.year.data = this.summarizeYear(this.dateRanges.year);

    let yearWkCtr = 0;

    for (let qtrRange of this.dateRanges.quarters) {
      let qtrS = qtrRange.start.quarter();
      let qtrL = qtrRange.start.format('Qo');
      let qtr = {
        sheet: `Q${qtrS} ${year}`,
        title: `${qtrL} Quarter ${year} ${dispo} ${sum}`,
        type: this.sum,
        data: {},
        months: []
      };

      qtr.data = this.summarizeQuarter(qtrRange);

      for (let monthRange of this.dateRanges.months) {
        if (monthRange.start.quarter() > qtrRange.start.quarter())
          break;

        let moS = monthRange.start.format('MMM');
        let moL = monthRange.start.format('MMMM');
        let month = {
          sheet: `${moS} ${year}`,
          title: `${moL} ${year} ${dispo} ${sum}`,
          type: this.sum,
          data: {},
          weeks: []
        };

        month.data = this.summarizeMonth(monthRange);

        let curWeek = 1;

        for (let weekRange of this.dateRanges.weeks.slice(yearWkCtr)) {
          if (weekRange.start.month() > monthRange.start.month())
            break;

          let week = {
            sheet: `${moS} Wk ${curWeek}`,
            title: `${moL} ${year} Week ${curWeek} ${dispo} ${sum}`,
            type: this.sum,
            data: {}
          };

          week.data = this.summarizeWeek(weekRange);
          month.weeks.push(week);

          curWeek++;
          yearWkCtr++;
        }

        qtr.months.push(month);
      }

      data.year.quarters.push(qtr);
    }

    return data;
  }

  summarizeYear(year) {
    return this.summarize(year, lod.MIN, 'plant', this.sum, this.filter);
  }

  summarizeQuarter(qtr) {
    return this.summarize(qtr, lod.MIN, 'partNum', this.sum, this.filter);
  }

  summarizeMonth(month) {
    return this.summarize(month, lod.MID, 'partNum', this.sum, this.filter);
  }

  summarizeWeek(week) {
    return this.summarize(week, lod.MAX, 'partNum', this.sum, this.filter);
  }

  summarize(dateRange, detail, group, sum, filter) {
    if (!(detail === lod.MAX || detail === lod.MID))
      detail = lod.MIN;

    let data = this.data.filterDate(dateRange.start, dateRange.end);

    let top = [];
    if (detail === lod.MID)
      top = data.top(5, group, sum, filter);
    else if (detail === lod.MAX)
      top = data.top('*', group, sum, filter);

    let reducedData = data.reduce(group, sum, filter);  // Now we have sum per group

    if (detail > lod.MIN) {
      let topDatasReduced = {};
      let i = 0;

      for (let item of top) {
        if (i > top.length)
          break;

        topDatasReduced[item] = data.reduce('defect', sum, v => (item === v.partNum) && this.filter(v));
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
