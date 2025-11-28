import { exec } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { promisify } from "node:util";
import { beforeAll, describe, expect, it } from "vitest";

const execAsync = promisify(exec);

describe("package build", () => {
    const distPath = resolve(__dirname, "../dist");
    const expectedFiles = [
        "index.cjs",
        "index.mjs",
        "index.d.cts",
        "index.d.mts",
    ];

    beforeAll(async () => {
        // Run the build process
        await execAsync("npm run prepack", {
            cwd: resolve(__dirname, ".."),
        });
    }, 60000); // 60 second timeout for build

    describe("build artifacts", () => {
        it("should create dist directory", () => {
            expect(existsSync(distPath)).toBe(true);
        });

        for (const file of expectedFiles) {
            it(`should generate ${file}`, () => {
                const filePath = resolve(distPath, file);
                expect(existsSync(filePath)).toBe(true);
            });
        }
    });

    describe("package validation", () => {
        it("should pass publint validation", async () => {
            const { stdout, stderr } = await execAsync(
                "npx publint --pack auto",
                {
                    cwd: resolve(__dirname, ".."),
                },
            );

            // publint exits with 0 if validation passes
            // Check output doesn't contain errors or warnings
            const output = stdout + stderr;
            expect(output).toContain("All good!");
            expect(output).not.toContain("Error");
        }, 30000); // 30 second timeout for publint
    });

    describe("build outputs", () => {
        it("should have valid CommonJS export", async () => {
            const cjsPath = resolve(distPath, "index.cjs");
            expect(existsSync(cjsPath)).toBe(true);

            // Try to require the built file
            const cjsModule = await import(cjsPath);
            expect(cjsModule).toBeDefined();
            expect(cjsModule.add).toBeDefined();
            expect(typeof cjsModule.add).toBe("function");
        });

        it("should have valid ESM export", async () => {
            const esmPath = resolve(distPath, "index.mjs");
            expect(existsSync(esmPath)).toBe(true);

            // Try to import the built file
            const esmModule = await import(esmPath);
            expect(esmModule).toBeDefined();
            expect(esmModule.add).toBeDefined();
            expect(typeof esmModule.add).toBe("function");
        });

        it("should have TypeScript declaration files", () => {
            const ctsPath = resolve(distPath, "index.d.cts");
            const mtsPath = resolve(distPath, "index.d.mts");

            expect(existsSync(ctsPath)).toBe(true);
            expect(existsSync(mtsPath)).toBe(true);
        });
    });

    describe("typescript source to output formats", () => {
        it("should generate CJS + MJS + d.ts outputs from TypeScript source", () => {
            // Verify TypeScript source exists
            const tsSourcePath = resolve(__dirname, "../src/index.ts");
            expect(existsSync(tsSourcePath)).toBe(true);

            // Verify all output formats are generated
            const outputs = {
                cjs: resolve(distPath, "index.cjs"),
                mjs: resolve(distPath, "index.mjs"),
                dcts: resolve(distPath, "index.d.cts"),
                dmts: resolve(distPath, "index.d.mts"),
            };

            // All output files must exist
            for (const [format, path] of Object.entries(outputs)) {
                expect(existsSync(path), `${format} output should exist`).toBe(
                    true,
                );
            }
        });

        it("should have CommonJS output with module.exports", () => {
            const cjsPath = resolve(distPath, "index.cjs");
            const content = readFileSync(cjsPath, "utf-8");

            // CJS should use module.exports or exports
            expect(
                content.includes("exports") ||
                    content.includes("module.exports"),
            ).toBe(true);
        });

        it("should have ESM output with ES6 export syntax", () => {
            const mjsPath = resolve(distPath, "index.mjs");
            const content = readFileSync(mjsPath, "utf-8");

            // ESM should use export keyword
            expect(content.includes("export")).toBe(true);
        });

        it("should have TypeScript declarations with exported types", () => {
            const dctsPath = resolve(distPath, "index.d.cts");
            const dmtsPath = resolve(distPath, "index.d.mts");

            const dctsContent = readFileSync(dctsPath, "utf-8");
            const dmtsContent = readFileSync(dmtsPath, "utf-8");

            // Both declaration files should export the same functions
            for (const content of [dctsContent, dmtsContent]) {
                expect(content.includes("export")).toBe(true);
                expect(
                    content.includes("add") || content.includes("function"),
                ).toBe(true);
            }
        });

        it("should preserve all exports from TypeScript source", async () => {
            const cjsPath = resolve(distPath, "index.cjs");
            const mjsPath = resolve(distPath, "index.mjs");

            const cjsModule = await import(cjsPath);
            const mjsModule = await import(mjsPath);

            // Both formats should export the same functions
            const expectedExports = ["add", "addRef"];

            for (const exportName of expectedExports) {
                expect(cjsModule[exportName]).toBeDefined();
                expect(mjsModule[exportName]).toBeDefined();
                expect(typeof cjsModule[exportName]).toBe("function");
                expect(typeof mjsModule[exportName]).toBe("function");
            }
        });

        it("should have matching TypeScript declarations for both module systems", () => {
            const dctsPath = resolve(distPath, "index.d.cts");
            const dmtsPath = resolve(distPath, "index.d.mts");

            const dctsContent = readFileSync(dctsPath, "utf-8");
            const dmtsContent = readFileSync(dmtsPath, "utf-8");

            // Both should declare the same exports
            const expectedDeclarations = ["add", "addRef"];

            for (const declaration of expectedDeclarations) {
                expect(
                    dctsContent.includes(declaration),
                    `${declaration} should be in index.d.cts`,
                ).toBe(true);
                expect(
                    dmtsContent.includes(declaration),
                    `${declaration} should be in index.d.mts`,
                ).toBe(true);
            }
        });
    });
});
