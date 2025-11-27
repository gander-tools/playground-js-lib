import { exec } from "node:child_process";
import { existsSync } from "node:fs";
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
		await execAsync("bun run prepack", {
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
			const { stdout, stderr } = await execAsync("bun run publint", {
				cwd: resolve(__dirname, ".."),
			});

			// publint exits with 0 if validation passes
			// Check output doesn't contain errors
			expect(stderr).toBe("");
			expect(stdout).not.toContain("error");
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
});
