
interface IObj {
  [key: string]: any;
}

const FontWeights: IObj = {
  UItraLight: '100',
  Thin: '200',
  Light: '300',
  Regular: '400',
  Medium: '500',
  Semibold: '600',
  normal: 'normal',
  bold: 'bold',
};

export const FontWeight: IObj = {};
for (const k of Object.keys(FontWeights)) {
  FontWeight[k] = {
    fontWeight: FontWeights[k],
  };
}
