import { describe, expect, it } from "vitest";
import { add, addRef } from "../src";

describe("add", () => {
    it("should be defined", () => {
        expect(add).toBeDefined();
    });
});

describe("addRef", () => {
    it("should be defined", () => {
        expect(addRef).toBeDefined();
    });
});
