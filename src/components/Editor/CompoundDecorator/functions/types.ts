import { DraftDecorator } from "draft-js";

type AzDecoratorOption = {
  name: string; // Other than "_undecorated"
  parentName?: string[];
  symbolType?: "same" | "different" | "noEndSign";
};
type AzDecorator = DraftDecorator & {
  option?: AzDecoratorOption;
};

type DecoratorRange = {
  id: number;
  start: number;
  end: number;
};
type DecoratorSymbol = {
  decoratorIndex: number;
  id: number;
  type: "start" | "end" | "single";
};
type DecoratorKey = {
  decoratorIndex: number;
  id: number;
};

type SymbolType = "same" | "different" | "noEndSign";
type HaveEverythingOption = {
  name: string | null; // Other than "_undecorated"
  parentName: string[] | null;
  symbolType: SymbolType;
};

type Token = {
  tokenType: "symbol";
  index: number;
  decoratorIndex: number;
  type: "start" | "end" | "single";
};

export type {
  AzDecoratorOption,
  AzDecorator,
  DecoratorRange,
  DecoratorSymbol,
  DecoratorKey,
  SymbolType,
  HaveEverythingOption,
  Token,
};
