const child_process = require('child_process');

const moment = require('moment');
const xlsx = require('xlsx');

const { DefectList, Defect } = require('./parts.js');
const { getDateRanges, output } = require('./util.js');


function get_defects(filename) {
  let wb = xlsx.readFile(filename);
  let data = xlsx.utils.sheet_to_json(wb.Sheets['Data']);

  return DefectList.fromRaw(data);
}

function summarize(data, group, sum, year, detail, filter) {
  if (!(detail === 'full' || detail === 'top5'))
    detail = 'none';

  data = get_data_between(data, year.start, year.end);

  let top_5 = [];
  if (detail === 'top5')
    top_5 = get_top_5(data, group, sum, filter);

  return data.reduce((acc, value) => {
    let group_val = value[group].toUpperCase();
    let model = value['MDL'];
    if (group_val in acc) {
      if (list_defects !== 0) {
        acc[group_val] = summarize(data, 'Defect', sum, year);
        list_defects--;
      } else {
        if (model in acc[group_val]) {
          acc[group_val][model] += value[sum];
        } else {
          acc[group_val][model] = value[sum];
        }
      }
    } else {
      acc[group_val] = {};
      acc[group_val][model] = value[sum];
    }
    return acc;
  }, {});
}

 
defect_data = get_defects('Non-Conforming List.xlsx');

/*top_scrap_parts_by_qty = get_top_5(defect_data, 'Part Num', 'NG Qty', {field: 'Disposition', val: 'SCRAP'});
top_scrap_parts_by_cost = get_top_5(defect_data, 'Part Num', 'Cost', {field: 'Disposition', val: 'SCRAP'});
top_rework_parts_by_qty = get_top_5(defect_data, 'Part Num', 'NG Qty', {field: 'Disposition', val: 'REWORK'});
*/

let ranges = getDateRanges(moment().endOf('year'));
let year_summary = summarize(defect_data, 'PL', 'NG Qty', ranges.year);
let quarter_summaries = ranges.quarters.map(
  v => summarize(defect_data, 'Part Num', 'NG Qty', v)
);
let month_summaries = ranges.months.map(
  v => summarize(defect_data, 'Part Num', 'NG Qty', v, 5)
);
let week_summaries = ranges.weeks.map(
  v => summarize(defect_data, 'Part Num', 'NG Qty', v, 'all')
);

console.log(week_summaries/*[
  {
    sheet: "Yearly 2017",
    title: "Year 2017 Scrap Defects",
    type: "yr:qty",
    data: year_summary
  }
]*/);

//output('report.xlsx', [1, 2, 3]);
