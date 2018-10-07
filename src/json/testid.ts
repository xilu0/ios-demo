// import { idlist } from './area/index.ts';
// console.log(idlist);
// tslint:disable
let idlist: any;

export const getIDList = (nameList: string[]): Array<number> => {
  if(!idlist){
    idlist = require('./area/index.ts').idlist;
  }
  return nameList.reduce((o, item, index) => {
    o.rs.push(idlist[o.prev + item]);
    o.prev = o.prev + item + '$';
    return o;
  }, {
    rs: [],
    prev: '',
  }).rs;
};
