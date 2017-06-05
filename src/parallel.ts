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
    const packagePaths = normalizePackagePaths(settings.paths);
    const fileReader = settings.fileReader === undefined
        ? (async (filePath: string) => (await readFileWithoutBom(filePath)).toString())
        : settings.fileReader;

    const dependencies = await getAllPackageDependencies(packagePaths, fileReader);

    return new ParallelBuildTracker(dependencies);
}
