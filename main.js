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

 
defect_data = get_defects('Non-Conforming List.xlsx');

/*top_scrap_parts_by_qty = get_top_5(defect_data, 'Part Num', 'NG Qty', {field: 'Disposition', val: 'SCRAP'});
top_scrap_parts_by_cost = get_top_5(defect_data, 'Part Num', 'Cost', {field: 'Disposition', val: 'SCRAP'});
top_rework_parts_by_qty = get_top_5(defect_data, 'Part Num', 'NG Qty', {field: 'Disposition', val: 'REWORK'});
*/

let ranges = getDateRanges(moment().endOf('year'));
let yearSummary = summarize(defect_data, 'PL', 'NG Qty', ranges.year);
let quarterSummaries = ranges.quarters.map(
  v => summarize(defect_data, 'Part Num', 'NG Qty', v)
);
let monthSummaries = ranges.months.map(
  v => summarize(defect_data, 'Part Num', 'NG Qty', v, 5)
);
let weekSummaries = ranges.weeks.map(
  v => summarize(defect_data, 'Part Num', 'NG Qty', v, 'all')
);

console.log(weekSummaries/*[
  {
    sheet: "Yearly 2017",
    title: "Year 2017 Scrap Defects",
    type: "yr:qty",
    data: yearSummary
  }
]*/);

//output('report.xlsx', [1, 2, 3]);
