/**
 * Sorts packages into a safe build order.
 *
 * @param packages   Packages with their dependencies.
 * @returns The packages in a safe build order.
 */
export function sortPackages(packages: Map<string, Set<string>>): string[] {
    const order: string[] = [];

    generateOrder(packages, new Map<string, boolean>(), order);

    return order;
}

/**
 * Recursively visits packages to generate a safe build order.
 *
 * @param packages   Packages with their dependencies.
 * @param visited   Which packages have been visited.
 * @param order   A safe build order in progress.
 */
function generateOrder(packages: Map<string, Set<string>>, visited: Map<string, boolean>, order: string[]): void {
    const visitPackage = (packageName: string): void => {
        if (visited.get(packageName) === true) {
            return;
        }

        visited.set(packageName, true);

        const dependencies = packages.get(packageName);
        if (dependencies !== undefined) {
            for (const dependency of dependencies) {
                if (packages.has(dependency)) {
                    visitPackage(dependency);
                }
            }
        }

        order.push(packageName);
    };

    for (const [packageName] of packages) {
        visitPackage(packageName);
    }
}
