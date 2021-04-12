import { getAllPackageDependencies } from "./reading";
import { ISettings, normalizeSettings } from "./settings";
import { sortPackages } from "./sorting";

/**
 * Sorts packages into a safe build order.
 *
 * @param settings   Settings to sort packages into a safe build order.
 * @returns A Promise for the packages in a safe build order.
 */
export async function buildOrder(settings: ISettings): Promise<string[]> {
    const normalizedSettings = normalizeSettings(settings);
    const dependencies = await getAllPackageDependencies(normalizedSettings);

    return sortPackages(dependencies);
}
