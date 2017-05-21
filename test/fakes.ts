import * as path from "path";

export const DEPENDENT = "dependent";
export const EXTERNAL = "external";
export const SINGLE = "single";
export const SOLO = "solo";
export const UNKNOWN = "unknown";

export type IPackageName = typeof DEPENDENT | typeof EXTERNAL | typeof SINGLE | typeof SOLO;

const stubPackageContents = {
    [path.join(DEPENDENT, ".json")]: JSON.stringify({
        dependencies: [SINGLE],
    }),
    [path.join(EXTERNAL, ".json")]: JSON.stringify({
        dependencies: [SINGLE, UNKNOWN],
    }),
    [path.join(SINGLE, ".json")]: JSON.stringify({}),
    [path.join(SOLO, ".json")]: JSON.stringify({}),
};

export const fileReader = async (packageName: IPackageName) => Promise.resolve(stubPackageContents[packageName]);

/**
 * Creates path settings pointing to the stubbed packages.
 *
 * @param packageName   Stubbed package names
 * @returns A Promise for stubbed path settings.
 */
export async function mockPathSettings(...packageNames: IPackageName[]): Promise<Map<string, string>> {
    const paths = new Map<string, string>();

    for (const packageName of packageNames) {
        paths.set(packageName, path.join(packageName, ".json"));
    }

    return paths;
}
