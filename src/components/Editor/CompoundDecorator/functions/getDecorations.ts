import { ContentBlock, ContentState } from "draft-js";
import {
  AzDecorator,
  DecoratorRange,
  DecoratorSymbol,
  HaveEverythingOption,
} from "@/components/Editor/CompoundDecorator/functions/types";

/**
 * 各デコレーターの影響範囲をまとめる
 * @return <pre>
 *   ex) [[{}:DecoratorRange, {}, ...], // Decorator1
 *   |    [...],                        // Decorator2
 *   |    [...],                        // Decorator3
 *   |    ...]
 *   </pre>
 */
const summarizeScopeOfDecorator = (
  decorators: AzDecorator[],
  block: ContentBlock,
  contentState: ContentState
) => {
  const emptyArr: DecoratorRange[][] = Array(decorators.length);
  console.log("empty", emptyArr);

  return decorators.reduce((decoratorsRange, decorator, decoratorIndex) => {
    const { strategy } = decorators[decoratorIndex];
    const decoratorRanges: DecoratorRange[] = [];
    let count = 0;
    const callback = (start: number, end: number) => {
      // indexがほしいため end=start+lengthだと1多い
      const endMinusOne = end - 1;
      decoratorRanges.push({
                             id : count,
                             start,
                             end: endMinusOne,
                           });
      count++;
    };

    strategy(block, callback, contentState);

    if (!(decoratorRanges.length === 0)) {
      // スコープはreduce内に限られるので問題ない
      // eslint-disable-next-line no-param-reassign
      decoratorsRange[decoratorIndex] = decoratorRanges;
    }
    return decoratorsRange;
  }, emptyArr);
};

const removeIncorrectNesting = () => {

}


/**
 * 各デコレーター競合を取り除き、Symbolの位置を返す。
 * @return  <pre>
 *  ex) [null,      // 1文字目
 *  |    null,      // 2文字目
 *  |    {}:Symbol, // 3文字目 Decoratorの先頭もしくは後尾
 *  |    null,      // 4文字目
 *  |    ...]
 * </pre>
 *
 */
const symbolNormalization = (
  blockLength: number,
  decoratorsRange: DecoratorRange[][],
  decoratorsOption: HaveEverythingOption[]
) => {
  const symbolLocation: DecoratorSymbol[][] = Array(blockLength);
  for (let i = 0; i < blockLength; i++) {
    symbolLocation[i] = [];
  }

  decoratorsRange.forEach((decoratorRanges, decoratorIndex) => {
    const option = decoratorsOption[decoratorIndex];
    decoratorRanges.forEach((decoratorRange, id) => {
      const { start, end } = decoratorRange;

      // parentが指定されていたら先に確認
      const { parentName } = decoratorsOption[decoratorIndex];
      if (parentName) {
        const parentNameIndex = parentName.map(v => decoratorsOption.findIndex(o => o.name === v));

        const parentStartSymbols: DecoratorSymbol[] = [];
        for (let i = 0; i <= start; i++) {
          const parentStartSymbol = symbolLocation[i].find(v =>
                                                             parentNameIndex.some(pIndex => v.decoratorIndex === pIndex)
          );
          if (parentStartSymbol) {
            parentStartSymbols.push(parentStartSymbol);
          }
        }

        // 自分を囲むparentがあるか
        const haveParentEndSymbol = Array(blockLength - end).some((v, i) =>
                                                                    symbolLocation[i + end].some(v =>
                                                                                                   parentStartSymbols.some(
                                                                                                     startSymbol =>
                                                                                                       v.decoratorIndex === startSymbol.decoratorIndex &&
                                                                                                       v.id === startSymbol.id &&
                                                                                                       v.type === "end"
                                                                                                   )
                                                                    )
        );
        if (!haveParentEndSymbol) return;
      }

      // 自身の範囲中にある閉じていないSymbolを収集
      const conflictingDecoratorSymbol: DecoratorSymbol[] = [];
      for (let charIndex = start + 1; charIndex < end; charIndex++) {
        const symbols = symbolLocation[charIndex];
        if (symbols.length !== 0) {
          symbols.forEach(symbol => {
            switch (symbol.type) {
              case "start":
                conflictingDecoratorSymbol.push(symbol);
                break;

              case "end": {
                // findIndexはlengthが0でも-1を返す
                const startSymbolIndex = conflictingDecoratorSymbol.findIndex(
                  v =>
                    v &&
                    v.decoratorIndex === symbol.decoratorIndex &&
                    v.id === symbol.id &&
                    v.type === "start"
                );

                if (startSymbolIndex === -1) {
                  conflictingDecoratorSymbol.push(symbol);
                } else {
                  conflictingDecoratorSymbol.splice(startSymbolIndex);
                }
              }
                break;

              case "single":
              default:
            }
          });
        }
      }
      // 境界
      (() => {
        const symbols = symbolLocation[start];

        symbols.forEach(symbol => {
          switch (symbol.type) {
            case "start": {
              const endSymbolIndex = conflictingDecoratorSymbol.findIndex(
                v =>
                  v &&
                  v.decoratorIndex === symbol.decoratorIndex &&
                  v.id === symbol.id &&
                  v.type === "end"
              );

              if (endSymbolIndex !== -1) {
                conflictingDecoratorSymbol.splice(endSymbolIndex);
              }
              break;
            }
            case "end":
              conflictingDecoratorSymbol.push(symbol);
              break;

            case "single":
            default:
          }
        });
      })();

      (() => {
        const symbols = symbolLocation[end];

        symbols.forEach(symbol => {
          switch (symbol.type) {
            case "start":
              conflictingDecoratorSymbol.push(symbol);
              break;

            case "end": {
              const startSymbolIndex = conflictingDecoratorSymbol.findIndex(
                v =>
                  v &&
                  v.decoratorIndex === symbol.decoratorIndex &&
                  v.id === symbol.id &&
                  v.type === "start"
              );

              if (startSymbolIndex !== -1) {
                conflictingDecoratorSymbol.splice(startSymbolIndex);
              }
              break;
            }
            case "single":
            default:
          }
        });
      })();

      // 競合範囲がなければそのまま登録
      if (conflictingDecoratorSymbol.length === 0) {
        symbolLocation[start].push({ decoratorIndex, id, type: "start" });
        symbolLocation[end].push({ decoratorIndex, id, type: "end" });
        console.log("ZERO", symbolLocation);
        return;
      }

      // optionに応じて自身のendSymbolを移動
      const existUnclosedStartSymbol = conflictingDecoratorSymbol.some(v => v.type === "start");
      const existUnclosedEndSymbol = conflictingDecoratorSymbol.some(v => v.type === "end");
      switch (option.symbolType) {
        case "noEndSign": {
          if (existUnclosedEndSymbol) {
            // 自身のstartSymbolをはさむDecoratorがあった場合、自身を破棄する
            return;
          }

          const newEndSymbolIndex =
                  symbolLocation.findIndex(symbols =>
                                             symbols.some(
                                               symbol =>
                                                 symbol.decoratorIndex === conflictingDecoratorSymbol[0].decoratorIndex &&
                                                 symbol.type === conflictingDecoratorSymbol[0].type &&
                                                 symbol.id === conflictingDecoratorSymbol[0].id
                                             )
                  ) - 1;
          if (newEndSymbolIndex === start) {
            // Decoratorの適用範囲が一文字になった
            symbolLocation[newEndSymbolIndex].push({ decoratorIndex, id, type: "single" });
          } else {
            symbolLocation[start].push({ decoratorIndex, id, type: "start" });
            symbolLocation[newEndSymbolIndex].push({ decoratorIndex, id, type: "end" });
          }
          return;
        }
        case "different":
        case "same":
          // 挟まっている方を削除

          if (existUnclosedStartSymbol && existUnclosedEndSymbol) {
            // どちらのSymbolも破棄
            return;
          }
          if (existUnclosedStartSymbol) {
            symbolLocation[start].push({ decoratorIndex, id, type: "start" });
          } else {
            symbolLocation[end].push({ decoratorIndex, id, type: "end" });
          }
          break;
        default:
      }
    });
  });
  return symbolLocation;
};

/**
 *
 *
 */
const deleteInvalidSymbols = (
  symbolLocation: DecoratorSymbol[][],
  options: HaveEverythingOption[]
): DecoratorSymbol[][] => {
  // Decoratorが閉じているか否かを管理
  const decoratorState: { [decoratorIndex: number]: "start" | "end" } = {};
  const getSameSymbolDecoratorState = (decoratorIndex: number) => {
    switch (decoratorState[decoratorIndex]) {
      case undefined:
        decoratorState[decoratorIndex] = "start";
        return "start";

      case "start":
        decoratorState[decoratorIndex] = "end";
        return "end";

      case "end":
        decoratorState[decoratorIndex] = "start";
        return "start";
      default:
        throw Error("tokenizer_unknownDecoratorIndex_n"); // もしエラーが出たらバグ
    }
  };
  const getDifferentSymbolDecoratorState = (
    decoratorIndex: number,
    type: "start" | "end"
  ): "start" | "end" | null => {
    switch (decoratorState[decoratorIndex]) {
      case undefined:
        if (type === "start") {
          decoratorState[decoratorIndex] = "start";
          return "start";
        }
        return null;

      case "start":
        if (type === "end") {
          decoratorState[decoratorIndex] = "end";
          return "end";
        }
        return null;

      case "end":
        if (type === "start") {
          decoratorState[decoratorIndex] = "start";
          return "start";
        }
        return null;

      default:
        throw Error("tokenizer_unknownDecoratorIndex_d"); // もしエラーが出たらバグ
    }
  };

  return symbolLocation.map(symbols =>
                              symbols
                                .map(symbol => {
                                  switch (options[symbol.decoratorIndex].symbolType) {
                                    case "same":
                                      return {
                                        ...symbol,
                                        type: getSameSymbolDecoratorState(symbol.decoratorIndex),
                                      };
                                    case "different":
                                      const type = getDifferentSymbolDecoratorState(
                                        symbol.decoratorIndex,
                                        <"start" | "end">symbol.type // symbolTypeがdifferentであればtypeはsingleにならない
                                      );

                                      if (type) {
                                        return {
                                          ...symbol,
                                          type,
                                        };
                                      }
                                      // 閉じない開始記号もしくは終了記号があれば捨てる
                                      return null;

                                    case "noEndSign":
                                      return {
                                        ...symbol,
                                      };
                                    default: // eslintのため
                                      return null;
                                  }
                                })
                                .filter((v): v is DecoratorSymbol => !!v)
  );
};
const toKeyList = (correctSymbolLocation: DecoratorSymbol[][]) => {
  const keyList: (Omit<DecoratorSymbol, "type"> | null)[][] = Array(correctSymbolLocation.length);
  for (let i = 0; i < correctSymbolLocation.length; i++) {
    keyList[i] = [];
  }

  console.log("emptyList", keyList);

  correctSymbolLocation.forEach((symbols, index, symbolArr) => {
    if (symbols.length === 0) return;

    symbols.forEach(symbol => {
      const { decoratorIndex, id, type } = symbol;
      switch (type) {
        case "start": {
          const endSymbolIndex = symbolArr.findIndex(_symbols =>
                                                       _symbols.some(_symbol => {
                                                         console.log(_symbol, symbol);
                                                         return (
                                                           _symbol.decoratorIndex === decoratorIndex &&
                                                           _symbol.id === id &&
                                                           _symbol.type === "end"
                                                         );
                                                       })
          );

          console.log("START", decoratorIndex, endSymbolIndex);

          for (let i = index; i <= endSymbolIndex; i++) {
            keyList[i].push({
                              decoratorIndex,
                              id,
                            });
          }
          break;
        }

        case "single":
          keyList[index].push({
                                decoratorIndex,
                                id,
                              });
          break;
        case "end":
        default:
      }
    });
  });

  console.log("keyList", keyList);
  console.log(
    "toStr",
    keyList.map((v, i) => {
      console.log(i, v);
      return JSON.stringify(v);
    })
  );
  return keyList.map(v => JSON.stringify(v));
};

export { summarizeScopeOfDecorator, symbolNormalization, deleteInvalidSymbols, toKeyList };
