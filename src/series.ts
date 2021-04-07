import { normalizePackagePaths, PackagePaths } from "./packages";
import { readFileWithoutBom } from "./readFileWithoutBom";
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
     * When reading dependencies, also check optionalDependencies
     */
    includeOptionalDependencies?: boolean;

    /**
     * When reading dependencies, also check peerDependencies
     */
    includePeerDependencies?: boolean;

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
    const normalizedSettings = {
        fileReader: (async (filePath: string) => (await readFileWithoutBom(filePath)).toString()),
        includeOptionalDependencies: false,
        includePeerDependencies: false,
        ...settings,
    };

    const packagePaths = normalizePackagePaths(settings.paths);

    const dependencies = await getAllPackageDependencies(
        packagePaths,
        normalizedSettings.fileReader,
        normalizedSettings.includeOptionalDependencies,
        normalizedSettings.includePeerDependencies);

    return sortPackages(dependencies);
}
