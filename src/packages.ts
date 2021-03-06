export interface IPackagePaths {
    [i: string]: string;
}

export type PackagePaths = IPackagePaths | Map<string, string>;

/**
 * Normalizes and copies a provided set of package paths into a Map.
 *
 * @praam packagePaths   Package paths, keyed by package name.
 * @returns An normalized copy of the raw package paths.
 */
export function normalizePackagePaths(packagePaths: PackagePaths): Map<string, string> {
    if (packagePaths instanceof Map) {
        return new Map(packagePaths);
    }

    const output = new Map<string, string>();

    for (const i in packagePaths) {
        if ([].hasOwnProperty.call(packagePaths, i) === true) {
            output.set(i, packagePaths[i]);
        }
    }

    return output;
}
