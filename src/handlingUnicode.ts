// TODO draft-jsも含めてユニコードに対応させる。
const segmenter = new Intl.Segmenter("ja");

export const unicode = {
  length: (text: string) => [...segmenter.segment(text)].length,
  slice: (text: string, start?: number, end?: number) => unicode.toArr(text).slice(start, end),
  toArr: (text: string) => [...segmenter.segment(text)].map(v => v.segment),
};
