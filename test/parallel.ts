import { expect } from "chai";

import { getBuildTracker } from "../lib/parallel";
import { ParallelBuildTracker } from "../lib/parallel/parallelBuildTracker";
import { DEPENDENT, fileReader, IPackageName, mockPathSettings, SINGLE, SOLO } from "./fakes";

/**
 * Creates a build tracker pointing to the stubbed packages.
 *
 * @param packageName   Stubbed package names
 * @returns A Promise for a new build tracker.
 */
async function mockBuildTracker(...packageNames: IPackageName[]): Promise<ParallelBuildTracker> {
    const paths = await mockPathSettings(...packageNames);

    return await getBuildTracker({ paths, fileReader });
}

describe("ParallelBuildTracker", () => {
    describe("getAvailablePackages", () => {
        it("gives no packages when given no packages", async () => {
            // Arrange
            const tracker = await mockBuildTracker();

            // Act
            const availablePackages = tracker.getAvailablePackages();

            // Assert
            expect(availablePackages).to.have.length(0);
        });

        it("gives all initial packages without dependencies ", async () => {
            // Arrange
            const tracker = await mockBuildTracker(SINGLE, SOLO);

            // Act
            const availablePackages = tracker.getAvailablePackages();

            // Assert
            expect(availablePackages).to.be.deep.equal([SINGLE, SOLO]);
        });

        it("gives only available initial packages when some have dependencies ", async () => {
            // Arrange
            const tracker = await mockBuildTracker(DEPENDENT, SINGLE);

            // Act
            const availablePackages = tracker.getAvailablePackages();

            // Assert
            expect(availablePackages).to.be.deep.equal([SINGLE]);
        });

        it("gives newly available packages when a dependency is completed ", async () => {
            // Arrange
            const tracker = await mockBuildTracker(SINGLE, DEPENDENT);
            tracker.markCompleted(SINGLE);

            // Act
            const availablePackages = tracker.getAvailablePackages();

            // Assert
            expect(availablePackages).to.be.deep.equal([SINGLE, DEPENDENT]);
        });
    });

    describe("markCompleted", () => {
        it("returns a newly available package", async () => {
            // Arrange
            const tracker = await mockBuildTracker(SINGLE, DEPENDENT);

            // Act
            const availablePackages = tracker.markCompleted(SINGLE);

            // Assert
            expect(availablePackages).to.be.deep.equal([DEPENDENT]);
        });

        it("returns a blank array when done", async () => {
            // Arrange
            const tracker = await mockBuildTracker(SINGLE, DEPENDENT);
            tracker.markCompleted(SINGLE);

            // Act
            const availablePackages = tracker.markCompleted(DEPENDENT);

            // Assert
            expect(availablePackages).to.have.length(0);
        });
    });
});
