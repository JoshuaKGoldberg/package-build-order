import * as path from "path";
import * as stripJsonComments from "strip-json-comments";
import { IExcludedDependenciesSettings, IFileReaderSettings } from "./settings";

interface IPackageInfo {
    dependencies?: string[] | Record<string, string>;
    devDependencies?: string[] | Record<string, string>;
    optionalDependencies?: string[] | Record<string, string>;
    peerDependencies?: string[] | Record<string, string>;
}

export interface IGetAllPackageDependenciesOptions extends IFileReaderSettings, IExcludedDependenciesSettings {
    /**
     * Package paths, keyed by package name.
     */
    paths: Map<string, string>;
}

interface IGetPackageDependenciesOptions extends IFileReaderSettings, IExcludedDependenciesSettings {
    /**
     * Path to a package file.
     */
    packagePath: string;
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
export async function getAllPackageDependencies(options: IGetAllPackageDependenciesOptions,
): Promise<Map<string, Set<string>>> {
    const packageDependencies = new Map<string, Set<string>>();
    const packageNames = new Set(options.paths.keys()) ;

    for (const [packageName, packagePath] of options.paths) {
        const dependencies = await getPackageDependencies({
            packagePath,
            ...options,
        });

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
 * @param options
 * @returns A Promise for the package's dependencies.
 */
async function getPackageDependencies(options: IGetPackageDependenciesOptions): Promise<Set<string>> {
    const {
        dependencies,
        devDependencies,
        optionalDependencies,
        peerDependencies,
    } = await getPackageContents(options.packagePath, options.fileReader);

    return new Set([
        ...flatten(dependencies),
        ...flatten(options.excludeDevDependencies ? [] : devDependencies),
        ...flatten(options.excludeOptionalDependencies ? [] : optionalDependencies),
        ...flatten(options.excludePeerDependencies ? [] : peerDependencies),
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
