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


class Report {}


module.exports = {};
