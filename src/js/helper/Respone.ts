import { strings } from 'js/helper/I18n';
import { showToast } from 'js/ui/components/Toast';
import { appBroadCast } from './Events';

export interface IResponse {
  data?: any;
  httpCode?: number;
  errorCode?: string;
}

export const errorHandle = (rs: Response) => {
  return rs.json().then((errRs: IResponse) => {
    // get i18n errorcode string (default request failed)
    const errCode = errRs.errorCode || 'requestFailed';
    const errStr = strings(errCode, {
      defaultValue: '',
    });
    showToast((errStr || errCode));
    appBroadCast.emit(errCode);
    return errRs;
  });
};

export const errorHandleThen = (callback: (errRs: IResponse) => void) => {
  return (rs: Response) => {
    return errorHandle(rs).then(callback);
  };
};
