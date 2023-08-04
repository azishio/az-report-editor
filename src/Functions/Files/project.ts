import {
  BaseDirectory,
  createDir,
  readBinaryFile,
  readDir,
  readTextFile,
  removeDir,
  removeFile,
  renameFile,
  writeBinaryFile,
  writeTextFile
} from "@tauri-apps/api/fs";

import moment from "moment";

// 更新するときに楽なので、構造化しない
// newInfo = {...beforeInfo, ...newParam}
export type ProjectInfo = {
  date_create: string;
  date_update: string;
};

export const defaultProjectInfo: ProjectInfo = {
  date_create: "",
  date_update: "",
};

export type ProjectData = ProjectInfo & { dirName: string };

const chars = "0123456789abcdefghijklmnopqrstuvwxyz";

export class Project {
  private static baseDir = BaseDirectory.AppData;

  private static basePath = "azReportEditorData\\projects";

  private static dirNameRegex = /\d{8}T\d{6}_(?<projectName>[^\\:*?"<>|]+)/u;

  private readonly dirPath: string;

  constructor(dirName: string) {
    this.dirPath = `${Project.basePath}\\${dirName}`;
  }

  static async create(projectName: string) {
    if (projectName === "") projectName = "No name defined";

    const m = moment();
    const time = m.format("YYYYMMDDTHHmmss");
    const dirName = `${time}_${projectName}`;
    const dirPath = `${Project.basePath}\\${dirName}`;
    await createDir(dirPath, { dir: Project.baseDir });

    const createDate = m.format("YYYY-MM-DD HH:mm:ss");

    const newProjectInfo: ProjectInfo = {
      date_create: createDate,
      date_update: createDate,
    };

    await writeTextFile(`${dirPath}\\project.info`, JSON.stringify(newProjectInfo), {
      dir: Project.baseDir,
    });
    await writeTextFile(`${dirPath}\\project.txt`, "", { dir: Project.baseDir });
    await createDir(`${dirPath}\\images`, {
      dir: Project.baseDir,
      recursive: true,
    });

    return dirName;
  }

  static async ls() {
    const dirList = await readDir(Project.basePath, { dir: Project.baseDir });
    // ユーザーが不正な名前のディレクトリを生成する可能性があるため
    const checkedDirList = dirList
      .filter(v => v.name && Project.dirNameRegex.test(v.name))
      .map(v => v.name!);

    const infoList = await Promise.all(
      checkedDirList.map(dirName =>
        readTextFile(`${Project.basePath}\\${dirName}\\project.info`, { dir: Project.baseDir })
      )
    ).then(infoText => infoText.map(v => JSON.parse(v) as ProjectInfo));

    return checkedDirList.map((dirName, i) => {
      const { date_create, date_update } = infoList[i];
      return {
        date_create,
        date_update,
        dirName,
      } as ProjectData;
    });
  }

  //
  static toProjectName(dirName: string) {
    const test = Project.dirNameRegex.exec(dirName);

    if (!test) {
      // エラーが発生としたらバグ
      // リリース時はこれが発生してはいけない
      throw new Error(`不正なdirNameを渡している:${dirName}`);
    }

    return test.groups!.projectName;
  }

  // winの使用禁止文字が含まれていればfalse
  static testProjectName(projectName: string) {
    return !/[\\:*?"<>|]/u.test(projectName);
  }

  async readInfo() {
    const info = await readTextFile(`${this.dirPath}\\project.info`, { dir: Project.baseDir });
    return JSON.parse(info) as ProjectInfo;
  }

  async delete() {
    await removeDir(this.dirPath, {
      dir: Project.baseDir,
      recursive: true,
    });
  }

  async rename(newName: string) {
    await renameFile(this.dirPath, newName, { dir: Project.baseDir });
  }

  readText() {
    return readTextFile(`${this.dirPath}\\project.txt`, { dir: Project.baseDir });
  }

  async writeText(text: string) {
    await writeTextFile(`${this.dirPath}\\project.txt`, text, { dir: Project.baseDir });
  }

  async writeInfo(info: ProjectInfo) {
    const validInfoValue: Partial<{ [prop in keyof ProjectInfo]: string }> = Object.fromEntries(
      Object.entries(info).filter(v => v[0] in defaultProjectInfo)
    );

    const beforInfo = await this.readInfo();

    await writeTextFile(
      `${this.dirPath}\\project.info`,
      JSON.stringify({ ...beforInfo, ...validInfoValue }),
      {
        dir: Project.baseDir,
      }
    );
  }

  async removeImage(name: string) {
    await removeFile(`${this.dirPath}\\images\\${name}`, { dir: Project.baseDir });
  }

  getImageList() {
    return readDir(`${this.dirPath}\\images`, { dir: Project.baseDir }).then(
      v => v.map(V => V.name).filter(name => !!name) as string[]
    );
  }

  async writeImage(file: File) {
    const imageList = await this.getImageList();

    let newFileName: string;
    // かぶりのない[0-9a-z]{5}のファイル名を生成
    do {
      newFileName = Array.from(
        { length: 2 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    } while (imageList.includes(newFileName));

    const img = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const dataURl = canvas.toDataURL("image/jpeg", 0.8);
    const jpegData = atob(dataURl.split(",")[1]);
    const uint8Array = Uint8Array.from(jpegData, c => c.charCodeAt(0));

    await createDir(`${this.dirPath}\\images`, {
      dir: Project.baseDir,
      recursive: true,
    });

    await writeBinaryFile(`${this.dirPath}\\images\\${newFileName}.jpeg`, uint8Array, {
      dir: Project.baseDir,
    });

    console.log("endwrite");
    return newFileName;
  }

  async readImageBinary(imageName: string) {
    const unit8Arr = await readBinaryFile(`${this.dirPath}\\images\\${imageName}`, {
      dir: Project.baseDir,
    });

    const fr = new FileReader();
    const dataURL = new Promise<string>(resolve => {
      fr.onload = () => {
        resolve(fr.result as string);
      };
    });

    fr.readAsDataURL(new Blob([unit8Arr], { type: "image/jpeg" }));

    return dataURL;
  }

  async renameImg(name: string, newName: string) {
    await renameFile(`${this.dirPath}\\images\\${name}`, newName, { dir: Project.baseDir });
  }
}
