enum RulesEnums {
  PASSWORD = 'PASSWORD',
  TELPHONE = 'TELPHONE',
  VERIFYCODE = 'VERIFYCODE',
  USERNAME = 'USERNAME',
  ALLNUMBER = 'ALLNUMBER',

  AMOUNT = 'AMOUNT',

  MONEY = 'MONEY',

}

const RulesKeys: {[index: string]: RegExp} = {
  PASSWORD: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/,
  TELPHONE: /^1\d{10}$/,
  VERIFYCODE: /^\d{6}$/,
  USERNAME:/^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
  ALLNUMBER:/^[0-9]*$/,

  AMOUNT: /^(([1-9]\d*)(\.\d{1,2})?)$|(0\.0?([1-9]\d?))$/,

  MONEY: /^(([1-9]{1}\d{0,4})|([0]{1}))(\.(\d){0,2})?$/,
};

const RulesErrors: {[index: string]: string} = {
  PASSWORD: '请输入8-18位不含特殊符号的字符密码',
  TELPHONE: '请输入正确手机号',
  VERIFYCODE: '请输入正确验证码',
  USERNAME:'请输入用户名',
  DEFAULT: '输入格式不正确',
  ALLNUMBER:'请输入数字',

  AMOUNT: '请输入正确的金额',

  MONEY: '请输入正确的金额',
};

export { RulesKeys, RulesErrors, RulesEnums };
