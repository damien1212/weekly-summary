const child_process = require('child_process');

const moment = require('moment');
const xlsx = require('xlsx');

const { DefectList, Defect } = require('./defects.js');
const { Report, levelOfDetail } = require('./report.js');
const { getDateRanges, output } = require('./util.js');


function get_defects(filename) {
  let wb = xlsx.readFile(filename);
  let data = xlsx.utils.sheet_to_json(wb.Sheets['Data']);

  return DefectList.fromRaw(data);
}

 
defectData = get_defects('Non-Conforming List.xlsx');

/*top_scrap_parts_by_qty = get_top_5(defectData, 'Part Num', 'NG Qty', {field: 'Disposition', val: 'SCRAP'});
top_scrap_parts_by_cost = get_top_5(defectData, 'Part Num', 'Cost', {field: 'Disposition', val: 'SCRAP'});
top_rework_parts_by_qty = get_top_5(defectData, 'Part Num', 'NG Qty', {field: 'Disposition', val: 'REWORK'});


let ranges = getDateRanges(moment().endOf('year'));
let yearSummary = summarize(defectData, 'PL', 'NG Qty', ranges.year);
let quarterSummaries = ranges.quarters.map(
  v => summarize(defectData, 'Part Num', 'NG Qty', v)
);
let monthSummaries = ranges.months.map(
  v => summarize(defectData, 'Part Num', 'NG Qty', v, 5)
);
let weekSummaries = ranges.weeks.map(
  v => summarize(defectData, 'Part Num', 'NG Qty', v, 'all')
);*/

report = new Report(defectData, moment());
report.summarize(report.dateRanges.year, levelOfDetail.MID, 'partNum', 'quantity', v => v.disposition === 'SCRAP');

//output('report.xlsx', [1, 2, 3]);
