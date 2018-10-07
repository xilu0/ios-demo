import { RootStore } from '../store/RootStore';

let rootStore: RootStore;

export const getStore = (): RootStore => {
  return rootStore;
};

export const setStore = (r: RootStore) => {
  rootStore = r;
};
