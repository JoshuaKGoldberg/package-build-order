import { readFile } from "mz/fs";

import { normalizePackagePaths, PackagePaths } from "./packages";
import { getAllPackageDependencies, IFileReader } from "./reading";
import { sortPackages } from "./sorting";

/**
 * Settings to sort packages into a safe build order.
 */
export interface IBuildOrderSettings {
    /**
     * Reads file contents.
     */
    fileReader?: IFileReader;

    /**
     * Package paths, keyed by package name.
     */
    paths: PackagePaths;
}

/**
 * Sorts packages into a safe build order.
 *
 * @param settings   Settings to sort packages into a safe build order.
 * @returns A Promise for the packages in a safe build order.
 */
export async function buildOrder(settings: IBuildOrderSettings): Promise<string[]> {
    const packagePaths = normalizePackagePaths(settings.paths);
    const fileReader = settings.fileReader === undefined
        ? (async (filePath: string) => (await readFile(filePath)).toString())
        : settings.fileReader;

    return sortPackages(await getAllPackageDependencies(packagePaths, fileReader));
}
