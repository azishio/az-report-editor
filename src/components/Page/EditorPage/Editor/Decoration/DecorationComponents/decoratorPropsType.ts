import { ReactNode } from "react";
import { ContentState } from "draft-js";

export type DecoratorPropsType = {
  [prop: string]: any;
  children: ReactNode;
  contentState: ContentState;
  decoratedText: string;
  decoratorInfo: {
    decoratorIndex: number;
    decoratorNames: string[];
    end: number;
    id: string;
    isEdge: boolean;
    keyArr: string[];
    start: number;
  };
  decoratorProps: { [prop: string]: any };
  offsetKey: string;
};
