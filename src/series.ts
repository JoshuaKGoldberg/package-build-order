import { normalizePackagePaths, PackagePaths } from "./packages";
import { getAllPackageDependencies } from "./reading";
import { sortPackages } from "./sorting";

export async function buildOrder(packagePaths: PackagePaths): Promise<string[]> {
    packagePaths = normalizePackagePaths(packagePaths);

    return sortPackages(await getAllPackageDependencies(packagePaths));
}
