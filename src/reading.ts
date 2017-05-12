import * as fs from "mz/fs";
import * as path from "path";

interface IDictionary<T> {
    [i: string]: T;
}

interface IPackageInfo {
    dependencies?: string[];
    devDependencies?: string[];
}

export async function getAllPackageDependencies(packagePaths: Map<string, string>): Promise<Map<string, Set<string>>> {
    const packageDependencies = new Map<string, Set<string>>();

    for (const [packageName, packagePath] of packagePaths) {
        packageDependencies.set(packageName, await getPackageDependencies(packagePath));
    }

    return packageDependencies;
}

async function getPackageDependencies(packageName: string): Promise<Set<string>> {
    const { dependencies, devDependencies } = await getPackageContents(packageName);

    return new Set([
        ...flatten(dependencies || {}),
        ...flatten(devDependencies || {}),
    ]);
}

async function getPackageContents(packageName: string): Promise<IPackageInfo> {
    const fileName = packageName.endsWith(".json")
        ? packageName
        : path.join(packageName, ".json");
    const contents = (await fs.readFile(fileName)).toString();

    return JSON.parse(contents);
}

function flatten(contents: string[] | IDictionary<string>): string[] {
    return contents instanceof Array
        ? contents
        : Object.keys(contents);
}
