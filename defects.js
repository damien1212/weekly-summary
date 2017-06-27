const moment = require('moment');


class DefectList {
  constructor(defects) {
    for (let defect of defects) {
      if (!(defect instanceof Defect)) {
        throw new Error('all defects must be instances of Defect')
      }
    }
    
    this.defects = defects;
  }

  static fromRaw(data) {
    let defects = [];

    for (let row of data) {
      row['Reject Date'] = moment(row['Reject Date'], 'MM/DD/YYYY');
      row['NG Qty'] = Number(row['NG Qty']);
      row['Cost'] = parseFloat(row['Cost'].replace(',', '').slice(1));
      defects.push(new Defect(row));
    }

    return new DefectList(defects);
  }

  top(num, group, sum, filter) {
    if (!group)
      group = 'partNum';
    if (!sum)
      sum = 'quantity';

    let defects = this.reduce(group, sum);

    defects = Object.entries(defects);
    defects.sort((a, b) => {
      if (a[1] > b[1])
        return -1;
      else if (a[1] < b[1])
        return 1;
      return 0;
    });

    return defects.slice(0, num).map(i => i[0]);
  }

  filter(func) {
    return new DefectList(this.defects.filter(func));
  }

  filterDate(start, end) {
    return this.filter(part => part.rejectDate.isBetween(start, end, '[]'));
  }

  reduce(group, sum, filter) {
    if (typeof filter !== 'function')
      filter = row => true;

    if (group === 'defect') debugger;

    return this.defects.reduce((acc,  row) => {
      let groupVal =  row[group].toUpperCase();

      if (filter(row)) {
        if (groupVal in acc) {
          acc[groupVal] += row[sum];
        } else {
          acc[groupVal] = row[sum];
        }
      }

      return acc;
    }, {}); 
  }
}


class Defect {
  constructor(part) {
    this.tagNum        = part['Tag Num'];
    this.rejectDate    = part['Reject Date'];
    this.plant         = part['PL'];
    this.model         = part['MDL'];
    this.partNum       = part['Part Num'];
    this.partName      = part['Part Name'];
    this.defect        = part['Defect'];
    this.quantity      = part['NG Qty'];
    this.Shift         = part['Shift'];
    this.station       = part['Station'];
    this.associate     = part['Associate'];
    this.cause         = part['Cause'];
    this.found         = part['Found'];
    this.responsible   = part['Responsible for'];
    this.disposition   = part['Disposition'];
    this.enteredBy     = part['Entered By'];
    this.Remark        = part['Remark'];
    this.injNum        = part['Inj Num'];
    this.d_date        = part['Dis Date'];
    this.d_quantity    = part['Dis Qty'];
    this.d_disposition = part['Disposal Contents'];
    this.d_disposedBy  = part['Disposed By'];
    this.cost          = part['Cost'];
  }
}


module.exports = {
  DefectList,
  Defect
};
