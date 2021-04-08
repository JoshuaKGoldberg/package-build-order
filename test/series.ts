import { expect } from "chai";
import { buildOrder } from "../lib/series";
import {
    DEPENDENT,
    DEV,
    fileReader,
    IPackageName,
    mockPathSettings,
    OPTIONAL,
    PEER,
    SINGLE,
    SOLO,
} from "./fakes";

/**
 * Generates a build order from stubbed packages.
 *
 * @param packageNames   Stubbed package names.
 * @returns A Promise for the packages' build order.
 */
async function mockBuildOrder(...packageNames: IPackageName[]): Promise<string[]> {
    const paths = await mockPathSettings(...packageNames);

    return await buildOrder({ paths, fileReader });
}

describe("buildOrder", () => {
    it("returns a single package", async () => {
        // Act
        const order = await mockBuildOrder(SOLO);

        // Assert
        expect(order).to.be.deep.equal([SOLO]);
    });

    it("returns packages in order when given in the correct order", async () => {
        // Act
        const order = await mockBuildOrder(SINGLE, DEPENDENT);

        // Assert
        expect(order).to.be.deep.equal([SINGLE, DEPENDENT]);
    });

    it("returns packages in order when given in an incorrect order", async () => {
        // Act
        const order = await mockBuildOrder(DEPENDENT, SINGLE);

        // Assert
        expect(order).to.be.deep.equal([SINGLE, DEPENDENT]);
    });

    it("returns packages in order when using dev dependencies", async () => {
        // Act
        const order = await mockBuildOrder(SINGLE, DEV, DEPENDENT);

        // Assert
        expect(order).to.be.deep.equal([SINGLE, DEV, DEPENDENT]);
    });

    it("returns packages in order when using peer dependencies", async () => {
        // Act
        const order = await mockBuildOrder(SINGLE, PEER, DEPENDENT);

        // Assert
        expect(order).to.be.deep.equal([SINGLE, PEER, DEPENDENT]);
    });

    it("returns packages in order when using optional dependencies", async () => {
        // Act
        const order = await mockBuildOrder(SINGLE, OPTIONAL, DEPENDENT);

        // Assert
        expect(order).to.be.deep.equal([SINGLE, OPTIONAL, DEPENDENT]);
    });
});
