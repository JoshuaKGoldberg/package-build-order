import * as fs from "mz/fs";
import * as path from "path";

interface IPackageInfo {
    dependencies?: string[];
    devDependencies?: string[];
}

export async function getAllPackageDependencies(packagePaths: Map<string, string>): Promise<Map<string, string[]>> {
    const packageDependencies = new Map<string, string[]>();

    for (const [packageName, packagePath] of packagePaths) {
        packageDependencies.set(packageName, await getPackageDependencies(packagePath));
    }

    return packageDependencies;
}

async function getPackageDependencies(packageName: string): Promise<string[]> {
    const { dependencies, devDependencies } = await getPackageContents(packageName);

    return Array.from(
        new Set([
            ...Object.keys(dependencies || {}),
            ...Object.keys(devDependencies || {}),
        ]));
}

async function getPackageContents(packageName: string): Promise<IPackageInfo> {
    const fileName = packageName.endsWith("package.json")
        ? packageName
        : path.join(packageName, "package.json");

    return JSON.parse((await fs.readFile(fileName)).toString());
}
