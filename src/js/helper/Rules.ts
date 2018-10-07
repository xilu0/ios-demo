import { RulesErrors, RulesKeys } from '../const/RulesKeys';

export interface IRule {
  rex: RegExp|string|((options?: any) => boolean);
  value?: string;
  message?: string;
}

export const test = (r: IRule): (boolean|string) => {
  const type = Object.prototype.toString.call(r.rex);

  if (type === '[object String]') {
    r.message = r.message || RulesErrors[r.rex as string];
    r.rex = RulesKeys[(r.rex as string)];
    return test(r);
  }
  if (type === '[object RegExp]') {
    if ((r.rex as RegExp).test(r.value || '')) {
      return true;
    }
  } else if (type === '[object Function]') {
    const rs = (r.rex as (options?: any) => boolean)(r.value);
    if (rs === true) {
      return true;
    }
  }
  return r.message || RulesErrors.DEFAULT;
};

export const testList = (rlist: IRule[]): (boolean|string) => {
  for (const r of rlist) {
    const rs = test(r);
    if (rs !== true) {
      return rs;
    }
  }
  return true;
};
