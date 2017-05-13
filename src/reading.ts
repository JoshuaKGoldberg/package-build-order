import * as fs from "mz/fs";
import * as path from "path";

interface IDictionary<T> {
    [i: string]: T;
}

interface IPackageInfo {
    dependencies?: string[];
    devDependencies?: string[];
}

/**
 * Retrieves dependencies for packages.
 *
 * @param packagePaths   Package paths, keyed by package name.
 * @returns A Promise for packages with their dependencies.
 */
export async function getAllPackageDependencies(packagePaths: Map<string, string>): Promise<Map<string, Set<string>>> {
    const packageDependencies = new Map<string, Set<string>>();

    for (const [packageName, packagePath] of packagePaths) {
        packageDependencies.set(packageName, await getPackageDependencies(packagePath));
    }

    return packageDependencies;
}

/**
 * Retrieves dependencies for a package.
 *
 * @param packagePath   Path to a package file.
 * @returns A Promise for the package's dependencies.
 */
async function getPackageDependencies(packagePath: string): Promise<Set<string>> {
    const { dependencies, devDependencies } = await getPackageContents(packagePath);

    return new Set([
        ...flatten(dependencies),
        ...flatten(devDependencies),
    ]);
}

/**
 * Retrieves the contents for a package.
 *
 * @returns A Promise for the parsed package contents.
 */
async function getPackageContents(packageName: string): Promise<IPackageInfo> {
    const fileName = packageName.endsWith(".json")
        ? packageName
        : path.join(packageName, ".json");
    const contents = (await fs.readFile(fileName)).toString();

    return JSON.parse(contents) as IPackageInfo;
}

/**
 * Flattens a dependencies mapping.
 *
 * @param contents   Some form of storage for dependencies.
 * @returns A flattened dependencies listing.
 */
function flatten(contents: string[] | IDictionary<string> = []): string[] {
    return contents instanceof Array
        ? contents
        : Object.keys(contents);
}
