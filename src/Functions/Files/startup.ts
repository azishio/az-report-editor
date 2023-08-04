import { BaseDirectory, createDir } from "@tauri-apps/api/fs";

const dir = BaseDirectory.AppData;
const startup = async () => {
  // データ格納用のディレクトリがなければ作成する
  await createDir("azReportEditorData\\projects", {
    dir,
    recursive: true,
  });
};

export default startup;
