import { readFile } from "mz/fs";

const BOM_HEX = 0xFEFF;

export const readFileWithoutBom = async (fileName: string) => {
    const contents = (await readFile(fileName)).toString();

    return contents.charCodeAt(0) === BOM_HEX
        ? contents.slice(1)
        : contents;
};
