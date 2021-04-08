import { normalizePackagePaths, PackagePaths } from "./packages";
import { readFileWithoutBom } from "./readFileWithoutBom";
import { IFileReader } from "./reading";

export interface IExcludedDependenciesSettings {
    /**
     * When reading dependencies, exclude devDependencies
     */
    excludeDevDependencies: boolean;

    /**
     * When reading dependencies, exclude optionalDependencies
     */
    excludeOptionalDependencies: boolean;

    /**
     * When reading dependencies, exclude peerDependencies
     */
    excludePeerDependencies: boolean;
}

export interface IFileReaderSettings {
   /**
    * Reads file contents.
    */
   fileReader: IFileReader;
}

/**
 * Settings to sort packages into a safe build order.
 */
export interface ISettings extends Partial<IFileReaderSettings>, Partial<IExcludedDependenciesSettings> {
    /**
     * Package paths, keyed by package name.
     */
    paths: PackagePaths;
}

/**
 * normalizes settings
 * @param settings Settings to normalize
 */
export function normalizeSettings(settings: ISettings) {
    return {
        excludeDevDependencies: false,
        excludeOptionalDependencies: false,
        excludePeerDependencies: false,
        fileReader: (async (filePath: string) => (await readFileWithoutBom(filePath)).toString()),
        ...settings,
        paths: normalizePackagePaths(settings.paths),
    };
}
