const parseExcelTable = (text: string[] | string, type: "csv" | "tsv") => {
  const DELIMITER = type === "csv" ? "," : "\t";
  const textArr = typeof text === "string" ? text.split("\n") : text;

  return textArr.map(line => {
    const parsedStr = [""];
    let arrIndex = 0;

    for (let i = 0; i < line.length; i++) {
      switch (line[i]) {
        case '"':
          i++; // "は読み捨て

          // excelのcsvは「hoge"huga」を"hoge""huga"と表記している
          // parsedStrの指定Indexの要素が空ではない場合、すでに"で区切る必要がある
          if (parsedStr[arrIndex].length !== 0) parsedStr[arrIndex] += '"';

          while (line[i] !== `"` && i < line.length) {
            parsedStr[arrIndex] += line[i];
            i++;
          }
          break;

        case DELIMITER:
          arrIndex++;
          parsedStr[arrIndex] = "";
          break;

        default:
          parsedStr[arrIndex] += line[i];
      }
    }
    return parsedStr;
  });
};

export default parseExcelTable;
