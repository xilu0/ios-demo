export const formatString =  (d: Date, _format?: string) => {

  let format = _format ||  'yyyy-MM-dd hh:mm:ss';

  const o: {[key: string]: any} = {
    'M+': d.getMonth() + 1,  // month
    'd+': d.getDate(),       // day
    'H+': d.getHours(),      // hour
    'h+': d.getHours(),      // hour
    'm+': d.getMinutes(),    // minute
    's+': d.getSeconds(),    // second
    'q+': Math.floor((d.getMonth() + 3) / 3), // quarter
    S: d.getMilliseconds(),
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (d.getFullYear() + '')
          .substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return format;
};
