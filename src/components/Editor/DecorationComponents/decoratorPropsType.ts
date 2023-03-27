import { ReactNode } from "react";

export type DecoratorPropsType = {
  children: ReactNode;
  blockKey: string;
  decorationName: string;
  offsetKey: string;
  decoratedText: string;
  [prop: string]: any;
};
