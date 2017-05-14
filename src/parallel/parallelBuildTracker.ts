/**
 * Tracks newly buildable packages.
 */
export class ParallelBuildTracker {
    /**
     * Packages that are available to build.
     */
    private readonly availablePackages: string[] = [];

    /**
     * Packages with their dependencies.
     */
    private readonly dependencies: Map<string, Set<string>>;

    /**
     * Initializes a new instance of the ParallelBuildTracker class.
     *
     * @param dependencies   Packages with their dependencies.
     */
    public constructor(dependencies: Map<string, Set<string>>) {
        this.dependencies = dependencies;
        this.getAvailablePackages();
    }

    /**
     * Gets packages that are ready to build.
     *
     * @returns Packages that are ready to build.
     */
    public getAvailablePackages(): string[] {
        this.availablePackages.push(...filterCompletedDependencies(this.dependencies));

        return this.availablePackages;
    }

    /**
     * Marks a package as being completed.
     *
     * @param packageName   Name of a newly completed package.
     * @returns Names of packages that are now able to build.
     */
    public markCompleted(packageName: string): string[] {
        const newlyAvailablePackages = filterCompletedDependencies(this.dependencies, packageName);

        this.availablePackages.push(...newlyAvailablePackages);

        return newlyAvailablePackages;
    }
}

/**
 * Filters out completed packages from a dependencies map.
 *
 * @param dependencies   Map of packages to their incomplete dependencies.
 * @param completedPackage   A newly completed package.
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
