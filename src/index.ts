import { getAllPackageDependencies } from "./reading";
import { sortPackages } from "./sorting";

export interface IPackagePaths {
    [i: string]: string;
}

export type PackagePaths = IPackagePaths | Map<string, string>;

export async function buildOrder(packagePaths: PackagePaths): Promise<string[]> {
    packagePaths = normalizePackagePaths(packagePaths);

    return sortPackages(await getAllPackageDependencies(packagePaths));
}

function normalizePackagePaths(packagePaths: PackagePaths): Map<string, string> {
    if (packagePaths instanceof Map) {
        return packagePaths;
    }

    const output = new Map<string, string>();

    for (const i in packagePaths) {
        if ({}.hasOwnProperty.call(packagePaths, i)) {
            output.set(i, packagePaths[i]);
        }
    }

    return output;
}
