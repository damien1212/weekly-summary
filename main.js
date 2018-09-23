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

let reportSQ = new Report(defectData, moment(), 'SCRAP', 'quantity');
output('scrap_quantity', reportSQ.generateReport());

let reportSC = new Report(defectData, moment(), 'SCRAP', 'cost');
output('scrap_cost', reportSC.generateReport());

let reportRQ = new Report(defectData, moment(), 'REWORK', 'quantity');
output('rework_quantity', reportRQ.generateReport());
