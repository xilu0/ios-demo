import { getStore } from './Store';

let timer = 0;
const timerCount = 0;

const clearTimer = () => {
  if (timer !== 0) {
    clearTimeout(timer);
    timer = 0;
  }
};

export const showLoading = (text: string = '', timeout: number = timerCount) => {
  const { loadingStore } = getStore().commonStore;
  loadingStore.show(text);
  if (timeout === 0) {
    return;
  }
  clearTimer();
  timer = setTimeout(() => {
    clearTimer();
    hideLoading();
  },                 timeout);
};

export const hideLoading = () => {
  const { loadingStore } = getStore().commonStore;
  loadingStore.hide();
  clearTimer();
};
