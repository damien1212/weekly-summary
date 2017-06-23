function getDateRanges(date) {
  if (!date)
    date = moment();

  let year = moment(date).startOf('y');
  let year_end = moment(year).endOf('y');

  let quarters = [];
  let c_qtr = moment(year);
  while (c_qtr.isBefore(moment.min(year_end, moment()))) {
    quarters.push({start: moment(c_qtr), end: moment(c_qtr).endOf('Q')});
    c_qtr.add(1, 'Q');
  }

  let months = [];
  let c_month = moment(year);
  while (c_month.isBefore(moment.min(year_end, moment()))) {
    months.push({start: moment(c_month), end: moment(c_month).endOf('M')});
    c_month.add(1, 'M');
  }

  let weeks = [];
  let c_week = moment(year);
  if (moment(c_week).startOf('w').isBefore(year))
    c_week.add(1, 'w').startOf('w');
  while (c_week.isBefore(moment.min(year_end, moment()))) {
    weeks.push({start: moment(c_week), end: moment(c_week).endOf('w')});
    c_week.add(1, 'w');
  }

  return {
    year: { start: year, end: year_end },
    quarters: quarters,
    months: months,
    weeks: weeks
  };
}

function output(filename, data) {
  const py = child_process.exec(`python3 output.py ${filename}`);

  py.stdout.on('data', chunk => process.stdout.write(chunk))
  py.stderr.on('data', chunk => process.stderr.write(chunk))

  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
}


module.exports = {
  getDateRanges: getDateRanges,
  output: output
};
