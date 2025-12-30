import { ref } from "@vue/reactivity";
import { describe, expect, it } from "vitest";
import { add, addRef, subtract } from "../src";

describe("add", () => {
    it("should be defined", () => {
        expect(add).toBeDefined();
        expect(typeof add).toBe("function");
    });

    it("should add two positive numbers correctly", () => {
        expect(add(2, 3)).toBe(5);
        expect(add(10, 20)).toBe(30);
        expect(add(100, 200)).toBe(300);
    });

    it("should add negative numbers correctly", () => {
        expect(add(-5, -3)).toBe(-8);
        expect(add(-10, -20)).toBe(-30);
    });

    it("should add positive and negative numbers correctly", () => {
        expect(add(5, -3)).toBe(2);
        expect(add(-5, 3)).toBe(-2);
        expect(add(10, -10)).toBe(0);
    });

    it("should handle zero correctly", () => {
        expect(add(0, 0)).toBe(0);
        expect(add(5, 0)).toBe(5);
        expect(add(0, 5)).toBe(5);
    });

    it("should handle decimal numbers correctly", () => {
        expect(add(1.5, 2.5)).toBe(4);
        expect(add(0.1, 0.2)).toBeCloseTo(0.3);
        expect(add(10.75, 5.25)).toBe(16);
    });

    it("should handle large numbers correctly", () => {
        expect(add(1000000, 2000000)).toBe(3000000);
        expect(add(Number.MAX_SAFE_INTEGER - 1, 1)).toBe(
            Number.MAX_SAFE_INTEGER,
        );
    });

    it("should handle very small numbers correctly", () => {
        expect(add(0.000001, 0.000002)).toBeCloseTo(0.000003);
    });
});

describe("addRef", () => {
    it("should be defined", () => {
        expect(addRef).toBeDefined();
        expect(typeof addRef).toBe("function");
    });

    it("should add two reactive refs correctly", () => {
        const a = ref(2);
        const b = ref(3);
        const result = addRef(a, b);

        expect(result.value).toBe(5);
    });

    it("should return a reactive computed ref", () => {
        const a = ref(10);
        const b = ref(20);
        const result = addRef(a, b);

        expect(result.value).toBe(30);

        // Change one ref value
        a.value = 15;
        expect(result.value).toBe(35);

        // Change the other ref value
        b.value = 25;
        expect(result.value).toBe(40);
    });

    it("should handle negative reactive numbers correctly", () => {
        const a = ref(-5);
        const b = ref(-3);
        const result = addRef(a, b);

        expect(result.value).toBe(-8);
    });

    it("should handle mixed positive and negative reactive numbers", () => {
        const a = ref(10);
        const b = ref(-5);
        const result = addRef(a, b);

        expect(result.value).toBe(5);

        a.value = -3;
        expect(result.value).toBe(-8);
    });

    it("should handle zero in reactive refs correctly", () => {
        const a = ref(0);
        const b = ref(0);
        const result = addRef(a, b);

        expect(result.value).toBe(0);

        a.value = 5;
        expect(result.value).toBe(5);

        b.value = 3;
        expect(result.value).toBe(8);
    });

    it("should handle decimal numbers in reactive refs correctly", () => {
        const a = ref(1.5);
        const b = ref(2.5);
        const result = addRef(a, b);

        expect(result.value).toBe(4);

        a.value = 0.1;
        b.value = 0.2;
        expect(result.value).toBeCloseTo(0.3);
    });

    it("should handle multiple reactive updates correctly", () => {
        const a = ref(1);
        const b = ref(1);
        const result = addRef(a, b);

        expect(result.value).toBe(2);

        // Multiple updates
        a.value = 5;
        expect(result.value).toBe(6);

        b.value = 10;
        expect(result.value).toBe(15);

        a.value = 0;
        expect(result.value).toBe(10);

        b.value = 0;
        expect(result.value).toBe(0);
    });

    it("should create independent computed refs for different calls", () => {
        const a1 = ref(1);
        const b1 = ref(2);
        const result1 = addRef(a1, b1);

        const a2 = ref(10);
        const b2 = ref(20);
        const result2 = addRef(a2, b2);

        expect(result1.value).toBe(3);
        expect(result2.value).toBe(30);

        // Changing one should not affect the other
        a1.value = 5;
        expect(result1.value).toBe(7);
        expect(result2.value).toBe(30);

        a2.value = 15;
        expect(result1.value).toBe(7);
        expect(result2.value).toBe(35);
    });

    it("should handle large numbers in reactive refs correctly", () => {
        const a = ref(1000000);
        const b = ref(2000000);
        const result = addRef(a, b);

        expect(result.value).toBe(3000000);

        a.value = Number.MAX_SAFE_INTEGER - 1;
        b.value = 1;
        expect(result.value).toBe(Number.MAX_SAFE_INTEGER);
    });
});

describe("subtract", () => {
    it("should be defined", () => {
        expect(subtract).toBeDefined();
        expect(typeof subtract).toBe("function");
    });

    it("should subtract two positive numbers correctly", () => {
        expect(subtract(5, 3)).toBe(2);
        expect(subtract(30, 10)).toBe(20);
        expect(subtract(300, 100)).toBe(200);
    });

    it("should subtract negative numbers correctly", () => {
        expect(subtract(-5, -3)).toBe(-2);
        expect(subtract(-10, -20)).toBe(10);
    });

    it("should subtract positive and negative numbers correctly", () => {
        expect(subtract(5, -3)).toBe(8);
        expect(subtract(-5, 3)).toBe(-8);
        expect(subtract(10, -10)).toBe(20);
    });

    it("should handle zero correctly", () => {
        expect(subtract(0, 0)).toBe(0);
        expect(subtract(5, 0)).toBe(5);
        expect(subtract(0, 5)).toBe(-5);
    });

    it("should handle decimal numbers correctly", () => {
        expect(subtract(4, 1.5)).toBe(2.5);
        expect(subtract(0.3, 0.1)).toBeCloseTo(0.2);
        expect(subtract(16, 5.25)).toBe(10.75);
    });
});
