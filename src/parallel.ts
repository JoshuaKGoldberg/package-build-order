import { normalizePackagePaths, PackagePaths } from "./packages";
import { getAllPackageDependencies } from "./reading";

export type BuildOrderGenerator = (completedPackage?: string) => Iterable<string[]>;

export async function buildParallel(packagePaths: PackagePaths): Promise<BuildOrderGenerator> {
    packagePaths = normalizePackagePaths(packagePaths);

    const dependencies = await getAllPackageDependencies(packagePaths);

    return function* (completedPackage?: string): Iterable<string[]> {
        if (dependencies.size === 0) {
            return;
        }

        return filterCompletedDependencies(dependencies, completedPackage);
    };
}

function filterCompletedDependencies(dependencies: Map<string, Set<string>>, completedPackage?: string) {
    const finishedPackages: string[] = [];

    for (const [packageName, packageDependencies] of dependencies) {
        if (completedPackage) {
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
