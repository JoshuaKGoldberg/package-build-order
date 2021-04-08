import { expect } from "chai";

import { getBuildTracker } from "../lib/parallel";
import { ParallelBuildTracker } from "../lib/parallel/parallelBuildTracker";
import {
    DEPENDENT,
    DEV,
    EXTERNAL,
    fileReader,
    IPackageName,
    mockPathSettings,
    OPTIONAL,
    PEER,
    SINGLE,
    SOLO,
} from "./fakes";

/**
 * Creates a build tracker pointing to the stubbed packages.
 *
 * @param packageNames   Stubbed package names.
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

        it("gives only available initial packages when some have dev dependencies ", async () => {
            // Arrange
            const tracker = await mockBuildTracker(DEPENDENT, DEV);

            // Act
            const availablePackages = tracker.getAvailablePackages();

            // Assert
            expect(availablePackages).to.be.deep.equal([DEV]);
        });

        it("gives only available initial packages when some have peer dependencies ", async () => {
            // Arrange
            const tracker = await mockBuildTracker(DEPENDENT, PEER);

            // Act
            const availablePackages = tracker.getAvailablePackages();

            // Assert
            expect(availablePackages).to.be.deep.equal([PEER]);
        });

        it("gives only available initial packages when some have optional dependencies ", async () => {
            // Arrange
            const tracker = await mockBuildTracker(DEPENDENT, OPTIONAL);

            // Act
            const availablePackages = tracker.getAvailablePackages();

            // Assert
            expect(availablePackages).to.be.deep.equal([OPTIONAL]);
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

        it("ignores unknown packages", async () => {
            // Arrange
            const tracker = await mockBuildTracker(SINGLE, EXTERNAL);

            // Act
            const availablePackages = tracker.markCompleted(SINGLE);

            // Assert
            expect(availablePackages).to.be.deep.equal([EXTERNAL]);
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
