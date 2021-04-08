import * as path from "path";
import * as stripJsonComments from "strip-json-comments";

interface IPackageInfo {
    dependencies?: string[] | Record<string, string>;
    devDependencies?: string[] | Record<string, string>;
    optionalDependencies?: string[] | Record<string, string>;
    peerDependencies?: string[] | Record<string, string>;
}

/**
 * Reads a file's contents.
 *
 * @param filePath   Path to a file.
 * @returns A Promise for the file's contents.
 */
export type IFileReader = (filePath: string) => Promise<string>;

/**
 * Retrieves dependencies for packages.
 *
 * @param packagePaths   Package paths, keyed by package name.
 * @param fileReader   Reads file contents.
 * @returns A Promise for packages with their dependencies.
 */
export async function getAllPackageDependencies(
    packagePaths: Map<string, string>,
    fileReader: IFileReader,
    includeOptionalDependencies: boolean,
    includePeerDependencies: boolean,
): Promise<Map<string, Set<string>>> {
    const packageDependencies = new Map<string, Set<string>>();
    const packageNames = new Set(packagePaths.keys()) ;

    for (const [packageName, packagePath] of packagePaths) {
        const dependencies = await getPackageDependencies(
            packagePath,
            fileReader,
            includeOptionalDependencies,
            includePeerDependencies);

        const knownDependencies = new Set(
            Array.from(dependencies)
                .filter(dependency => packageNames.has(dependency)));

        packageDependencies.set(packageName, knownDependencies);
    }

    return packageDependencies;
}

/**
 * Retrieves dependencies for a package.
 *
 * @param packagePath   Path to a package file.
 * @param fileReader   Reads file contents.
 * @returns A Promise for the package's dependencies.
 */
async function getPackageDependencies(
    packagePath: string,
    fileReader: IFileReader,
    includeOptionalDependencies: boolean,
    includePeerDependencies: boolean,
): Promise<Set<string>> {
    const {
        dependencies,
        devDependencies,
        optionalDependencies,
        peerDependencies,
    } = await getPackageContents(packagePath, fileReader);

    return new Set([
        ...flatten(dependencies),
        ...flatten(devDependencies),
        ...flatten(includeOptionalDependencies ? optionalDependencies : []),
        ...flatten(includePeerDependencies ? peerDependencies : []),
    ]);
}

/**
 * Retrieves the contents for a package.
 *
 * @param packagePath   Path to a package file.
 * @param fileReader   Reads file contents.
 * @returns A Promise for the parsed package contents.
 */
async function getPackageContents(packagePath: string, fileReader: IFileReader): Promise<IPackageInfo> {
    const filePath = packagePath.endsWith(".json")
        ? packagePath
        : path.join(packagePath, ".json");

    return JSON.parse(stripJsonComments(await fileReader(filePath))) as IPackageInfo;
}

/**
 * Flattens a dependencies mapping.
 *
 * @param contents   Some form of storage for dependencies.
 * @returns A flattened dependencies listing.
 */
function flatten(contents: string[] | Record<string, string> = []): string[] {
    return contents instanceof Array
        ? contents
        : Object.keys(contents);
}
