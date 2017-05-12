export interface IPackagePaths {
    [i: string]: string;
}

export type PackagePaths = IPackagePaths | Map<string, string>;

export function normalizePackagePaths(packagePaths: PackagePaths): Map<string, string> {
    if (packagePaths instanceof Map) {
        return new Map(packagePaths);
    }

    const output = new Map<string, string>();

    for (const i in packagePaths) {
        if ({}.hasOwnProperty.call(packagePaths, i)) {
            output.set(i, packagePaths[i]);
        }
    }

    return output;
}
