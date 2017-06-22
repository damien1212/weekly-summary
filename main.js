const child_process = require('child_process');

const moment = require('moment');
const xlsx = require('xlsx');


function money_to_number(money) {
  return parseFloat(money.replace(',', '').slice(1));
}

function get_data(filename) {
  let wb = xlsx.readFile(filename);
  let data = xlsx.utils.sheet_to_json(wb.Sheets['Data']);

  for (row of data) {
    row['Reject Date'] = moment(row['Reject Date'], 'MM/DD/YYYY');

    // Previously used for testing, don't wanna completely remove, just in case.
    // row['NG Qty__real'] = row['NG Qty'];
    // row['Cost__real'] = row['Cost'];

    row['NG Qty'] = Number(row['NG Qty']);
    row['Cost'] = money_to_number(row['Cost']);
  }

  return data
}

function get_data_between(data, date1, date2) {
  return data.filter(item => item['Reject Date'].isBetween(date1, date2, '[)'));
}

function get_top_5(data, group, sum, filter) {
  let parts = {};

  for (row of data) {
    if (row[filter.field] == filter.val) {
      let n = row[group];
      parts[n] = parts[n] ? parts[n] + row[sum] : row[sum];
    }
  }

  parts = Object.entries(parts);
  parts.sort((a, b) => {
    if (a[1] > b[1])
      return -1;
    else if (a[1] < b[1])b 
      return 1;
    else
      return 0;
  });

  console.log(parts.slice(0, 5));

  return parts.slice(0, 5);
}

function summarize_year(data, group, sum, year) {
  return data.filter(row => row['Reject Date'].year() === year)
    .reduce((d, v) => {
      if (v[group] in d) {
        d[v[group]] += v[sum];
      } else {
        d[v[group]] = v[sum];
      }

      return d;
    });
}

function output(filename, data) {
  const py = child_process.exec(`python3 output.py ${filename}`);

  py.stdout.on('data', chunk => process.stdout.write(chunk))
  py.stderr.on('data', chunk => process.stderr.write(chunk))

  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
}


defect_data = get_data('Non-Conforming List.xlsx')

top_scrap_parts_by_qty = get_top_5(defect_data, 'Part Num', 'NG Qty', {field: 'Disposition', val: 'SCRAP'});
top_scrap_parts_by_cost = get_top_5(defect_data, 'Part Num', 'Cost', {field: 'Disposition', val: 'SCRAP'});
top_rework_parts_by_qty = get_top_5(defect_data, 'Part Num', 'NG Qty', {field: 'Disposition', val: 'REWORK'});

output('report.xlsx', {});
