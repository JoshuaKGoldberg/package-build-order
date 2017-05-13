import { normalizePackagePaths, PackagePaths } from "./packages";
import { getAllPackageDependencies } from "./reading";
import { sortPackages } from "./sorting";

/**
 * Sorts packages into a safe build order.
 *
 * @param packages   Packages with their dependencies.
 * @returns A Promise for the packages in a safe build order.
 */
export async function buildOrder(packagePaths: PackagePaths): Promise<string[]> {
    packagePaths = normalizePackagePaths(packagePaths);

    return sortPackages(await getAllPackageDependencies(packagePaths));
}
