import { ParallelBuildTracker } from "./parallel/parallelBuildTracker";
import { getAllPackageDependencies } from "./reading";
import { ISettings, normalizeSettings } from "./settings";

/**
 * Creates a tracker for newly buildable packages given completed dependencies.
 *
 * @param settings   Settings to get a build tracker.
 * @returns A Promise for a package build tracker.
 */
export async function getBuildTracker(settings: ISettings): Promise<ParallelBuildTracker> {
    const normalizedSettings = normalizeSettings(settings);
    const dependencies = await getAllPackageDependencies(normalizedSettings);

    return new ParallelBuildTracker(dependencies);
}
