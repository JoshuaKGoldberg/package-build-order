import { normalizePackagePaths, PackagePaths } from "./packages";
import { getAllPackageDependencies } from "./reading";

export type BuildOrderGenerator = (completedPackage?: string) => Iterable<string[] | undefined>;

/**
 * Creates a generator for newly buildable packages given completed dependencies.
 *
 * @param packagePaths   Package paths, keyed by package name.
 * @returns A Promise for a buildable promise generator.
 */
export async function buildParallel(packagePaths: PackagePaths): Promise<BuildOrderGenerator> {
    packagePaths = normalizePackagePaths(packagePaths);

    const dependencies = await getAllPackageDependencies(packagePaths);

    return function* (completedPackage?: string): Iterable<string[] | undefined> {
        if (dependencies.size === 0) {
            return undefined;
        }

        return filterCompletedDependencies(dependencies, completedPackage);
    };
}

/**
 * Filters out completed packages from a dependencies map.
 *
 * @param dependencies   Map of packages to their incomplete dependencies.
 * @param completedPackage   A newly completed package, if not the first filter iteration.
 * @returns Newly buildable packages.
 */
function filterCompletedDependencies(dependencies: Map<string, Set<string>>, completedPackage?: string): string[] {
    const finishedPackages: string[] = [];

    for (const [packageName, packageDependencies] of dependencies) {
        if (completedPackage !== undefined) {
            packageDependencies.delete(completedPackage);
        }

        if (packageDependencies.size === 0) {
            finishedPackages.push(packageName);
        }
    }

    for (const packageName of finishedPackages) {
        dependencies.delete(packageName);
    }

    return finishedPackages;
}
