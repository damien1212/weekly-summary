class DefectList {
  constructor(defects) {
    for (defect of defects) {
      if (!(defect instanceof Defect)) {
        throw new Error('all defects must be instances of Defect')
      }
    }
    
    this.defects = defects;
  }

  static fromRaw(data) {
    let defects = [];

    for (row of data) {
      row['Reject Date'] = moment(row['Reject Date'], 'MM/DD/YYYY');
      row['NG Qty'] = Number(row['NG Qty']);
      row['Cost'] = parseFloat(row['Cost'].replace(',', '').slice(1));
      defects.push(Defect(row));
    }

    return DefectList(defects);
  }

  top(num, group, sum) {
    if (!group)
      group = 'part_num'
    if (!sum)
      sum = 'quantity';

    let defects = this.defects.reduce((acc, val) => {
      if (val[group] in acc) {
        acc[val[group]] += val[sum];
      } else {
        acc[val[group]] = val[sum];
      }
    }, {});

    defects = Object.entries(defects);
    defects.sort((a, b) => {
      if (a[1] > b[1])
        return -1;
      else if (a[1] < b[1])
        return 1;
      return 0;
    });

    return defects.slice(0, 5).map(i => i[0]);
  }

  getDateRange(start, end) {
    return this.defects.filter(
      part => part.reject_date.isBetween(start, end, '[]')
    );
  }
}


class Defect {
  constructor(part) {
    this.tag_num       = part['Tag Num'];
    this.reject_date   = part['Reject Date'];
    this.plant         = part['PL'];
    this.model         = part['MDL'];
    this.part_num      = part['Part Num'];
    this.part_name     = part['Part Name'];
    this.defect        = part['Defect'];
    this.quantity      = part['NG Qty'];
    this.Shift         = part['Shift'];
    this.station       = part['Station'];
    this.associate     = part['Associate'];
    this.cause         = part['Cause'];
    this.found         = part['Found'];
    this.responsible   = part['Responsible for'];
    this.disposition   = part['Disposition'];
    this.entered_by    = part['Entered By'];
    this.Remark        = part['Remark'];
    this.inj_num       = part['Inj Num'];
    this.d_date        = part['Dis Date'];
    this.d_quantity    = part['Dis Qty'];
    this.d_disposition = part['Disposal Contents'];
    this.d_disposed_by = part['Disposed By'];
    this.cost          = part['Cost'];
  }
}


module.exports = {
  DefectList: DefectList,
  Defect: Defect
};
