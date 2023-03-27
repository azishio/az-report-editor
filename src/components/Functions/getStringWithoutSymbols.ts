type Type = "header" | "unordered-list";
export const getStringWithoutSymbols = (type: Type, decoratedText: string, isBOL: boolean) => {
  if (isBOL) {
    switch (type) {
      case "header":
        return /#+ (?<content>[^[]*)(\[.*])?/.exec(decoratedText)!.groups!.content;

      case "unordered-list":
        return /\+ +(?<content>.*)/.exec(decoratedText)!.groups!.content;

      default:
        return decoratedText;
    }
  }
  return decoratedText;
};
