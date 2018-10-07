const Global: {[key: string]: any} = {};

export const getGlobalVal = (key: string) => {
  return Global[key];
};

export const setGlobalVal = (key: string, val: any) => {
  return Global[key] = val;
};
