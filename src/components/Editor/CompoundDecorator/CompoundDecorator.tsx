/* eslint no-underscore-dangle: 0 */
import { ContentBlock, ContentState, DraftDecoratorType } from "draft-js";
import Immutable from "immutable";
import {
  deleteInvalidSymbols,
  summarizeScopeOfDecorator,
  symbolNormalization,
  toKeyList,
} from "@/components/Editor/CompoundDecorator/functions/getDecorations";

import {
  AzDecorator,
  DecoratorRange,
  DecoratorSymbol,
  HaveEverythingOption,
  SymbolType,
} from "@/components/Editor/CompoundDecorator/functions/types";
import { checkAndReturnOptions } from "@/components/Editor/CompoundDecorator/functions/constructor";
/* eslint max-classes-per-file: 0 */

const { List } = Immutable;

/**
 * draft-jsのDraftDecoratorタイプを拡張
 * <dl>
 * <dt>name</dt>
 * <dd>Decorator's identifier. Other than "_undecorated".</dd>
 * <dt>parentName</dt>
 * <dd>
 * DecoratorComponent can only exist within Decorator's Component in the array.
 * The Decorator specified here must have been defined before itself.
 * The "_undecorated" can be used as the "name" to indicate the range to which no decorator applies.
 * </dd>
 * <dt>symbolType</dt>
 * <dd>
 * Determine behavior when Decorator is not correctly nested.
 * Default is "same", but this can be changed with the second argument of the CompoundDecorator constructor.
 * <ul>
 * <li>same: The start and end symbols are the same. ex) /~[^~]+~/gu
 * <li>different: The start and end symbols are different. ex) /\(.+\)/gu
 * <li>noEndSign: The ending sign does not matter. ex) /#.+/gu
 * </ul>
 * </dd>
 * </dl>
 * Please see readme.md for details and the original Japanese text.
 *
 * (Translated by DeepL)
 */

// CompositeDecoratorが返すコンポーネントをいじる
// 書き方が古くて継承方法がわからないので書き直し
// 元のCompositeDraftDecoratorをクラスベースで書き直して、必要な箇所を修正

export default class CompoundDecorator implements DraftDecoratorType {
  private _decorators: Array<AzDecorator>;

  private _option: HaveEverythingOption[];

  constructor(decorator: Array<AzDecorator>, defaultSymbolType: SymbolType = "same") {
    this._decorators = [...decorator];
    this._option = checkAndReturnOptions(this._decorators, defaultSymbolType);
  }

  getDecorations(block: ContentBlock, contentState: ContentState): Immutable.List<string> {
    const decoratorsRange: DecoratorRange[][] = summarizeScopeOfDecorator(
      this._decorators,
      block,
      contentState
    );

    console.log("range", decoratorsRange);

    const symbolLocation = symbolNormalization(
      block.getText().length,
      decoratorsRange,
      this._option
    );

    console.log("location", symbolLocation);

    const noIllegalSymbolArr = deleteInvalidSymbols(symbolLocation, this._option);

    const assertedDecorations = toKeyList(noIllegalSymbolArr) as string[];

    console.log("decorations", assertedDecorations);
    return List(assertedDecorations);
  }

  // _decoration からコンポーネントが読めれば良い
  getComponentForKey(stringKey: string): Function {
    // ネストの深いところから組み立てたい
    const keyArr: (Omit<DecoratorSymbol, "type"> | null)[] = JSON.parse(stringKey).reverse();

    console.log("key", keyArr);

    function Dummy(props: { [prop: string]: any }) {
      const { children } = props;
      return <span>{children}</span>;
    }

    if (!keyArr[0]) {
      return Dummy;
    }

    const Decorators = keyArr.reduce((CD, key) => {
      const { decoratorIndex } = key;
      const Decorator = this._decorators[decoratorIndex].component;
      const decoratorProps = this._decorators[decoratorIndex].props || {};
      return function AzCompoundDecoratorWrapper(props) {
        return (
          <Decorator {...props} {...decoratorProps}>
            <CD {...props} />
          </Decorator>
        );
      };
    }, Dummy);

    return function AzCompoundDecoratorWrapper(props: { [prop: string]: any }) {
      const { children } = props;
      return <Decorators {...props}>{children}</Decorators>;
    };
  }

  // draft-jsが要求してるから仕方ない。
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  getPropsForKey(stringKey: string): Object {
    // 全部必要になるので、getComponentForKeyで_decoratorから取得する
    return {};
  }
}

// <参考> クラスベースで書いた改変前のCompositeDecorator
/*
 export class CompositeDecorator implements DraftDecoratorType {
 private _decorators: Array<DraftDecorator>;

 constructor(decorator: Array<DraftDecorator>) {
 this._decorators = [...decorator];
 }

 getDecorations(block: ContentBlock, contentState: ContentState): Immutable.List<string> {
 const decorations: Array<null | string> = Array(block.getText().length).fill(null);
 let counter = 0;
 this._decorators.forEach((decorator, i) => {
 const { strategy } = decorator;
 const callback = (start: number, end: number) => {
 // eslint-disable-next-line @typescript-eslint/no-use-before-define
 if (canOccupySlice(decorations, start, end)) {
 const componentKey = `${i}.${counter}`;
 // eslint-disable-next-line @typescript-eslint/no-use-before-define
 occupySlice(decorations, start, end, componentKey);
 counter++;
 }
 };

 strategy(block, callback, contentState);
 });

 // CompositeDecoratorの実装を見ても、nullが入ってる気がする
 const assertedDecorations = decorations as string[];
 return List(assertedDecorations);
 }

 getComponentForKey(key: string): Function {
 const componentKey = parseInt(key.split(".")[0], 10);
 return this._decorators[componentKey].component;
 }

 getPropsForKey(key: string): Object {
 const componentKey = parseInt(key.split(".")[0], 10);
 return this._decorators[componentKey].props || {};
 }
 }

 function canOccupySlice(decorations: Array<string | null>, start: number, end: number) {
 for (let i = start; i < end; i++) {
 if (decorations[i]) {
 return false;
 }
 }
 return true;
 }

 function occupySlice(
 targetArr: Array<null | string>,
 start: number,
 end: number,
 componentKey: string
 ) {
 for (let i = start; i < end; i++) {
 // eslint-disable-next-line no-param-reassign
 targetArr[i] = componentKey;
 }
 }

 */
