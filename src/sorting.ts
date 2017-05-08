export function sortPackages(packages: Map<string, string[]>): string[] {
    const order: string[] = [];

    generateOrder(packages, new Map<string, boolean>(), order);

    return order;
}

function generateOrder(packages: Map<string, string[]>, visited: Map<string, boolean>, order: string[]): void {
    const visitPackage = (packageName: string): void => {
        if (visited.get(packageName)) {
            return;
        }

        visited.set(packageName, true);

        for (const dependency of packages.get(packageName) || []) {
            if (packages.has(dependency)) {
                visitPackage(dependency);
            }
        }

        order.push(packageName);
    };

    for (const [packageName] of packages) {
        visitPackage(packageName);
    }
}
