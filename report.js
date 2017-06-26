function summarize(data, group, sum, year, detail, filter) {
  if (!(detail === 'full' || detail === 'top5'))
    detail = 'none';

  data = getDataBetween(data, year.start, year.end);

  let top5 = [];
  if (detail === 'top5')
    top5 = getTop5(data, group, sum, filter);

  return data.reduce((acc, value) => {
    let groupVal = value[group].toUpperCase();
    let model = value['MDL'];
    if (groupVal in acc) {
      if (listDefects !== 0) {
        acc[groupVal] = summarize(data, 'Defect', sum, year);
        listDefects--;
      } else {
        if (model in acc[groupVal]) {
          acc[groupVal][model] += value[sum];
        } else {
          acc[groupVal][model] = value[sum];
        }
      }
    } else {
      acc[groupVal] = {};
      acc[groupVal][model] = value[sum];
    }
    return acc;
  }, {});
}


class Report {}


module.exports = {};
