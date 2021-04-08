import { normalizePackagePaths, PackagePaths } from "./packages";
import { ParallelBuildTracker } from "./parallel/parallelBuildTracker";
import { readFileWithoutBom } from "./readFileWithoutBom";
import { getAllPackageDependencies, IFileReader } from "./reading";

/**
 * Settings to get a build tracker.
 */
export interface IBuildTrackerSettings {
    /**
     * Reads file contents.
     */
    fileReader?: IFileReader;

    /**
     * When reading dependencies, also check optionalDependencies
     */
    includeOptionalDependencies?: boolean;

    /**
     * When reading dependencies, also check peerDependencies
     */
    includePeerDependencies?: boolean;

    /**
     * Package paths, keyed by package name.
     */
    paths: PackagePaths;
}

/**
 * Creates a tracker for newly buildable packages given completed dependencies.
 *
 * @param settings   Settings to get a build tracker.
 * @returns A Promise for a package build tracker.
 */
export async function getBuildTracker(settings: IBuildTrackerSettings): Promise<ParallelBuildTracker> {
    const normalizedSettings = {
        fileReader: (async (filePath: string) => (await readFileWithoutBom(filePath)).toString()),
        includeOptionalDependencies: false,
        includePeerDependencies: false,
        ...settings,
    };

    const packagePaths = normalizePackagePaths(settings.paths);

    const dependencies = await getAllPackageDependencies(
        packagePaths,
        normalizedSettings.fileReader,
        normalizedSettings.includeOptionalDependencies,
        normalizedSettings.includePeerDependencies);

    return new ParallelBuildTracker(dependencies);
}
