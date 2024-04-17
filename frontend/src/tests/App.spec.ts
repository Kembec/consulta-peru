import { expect, test } from "@playwright/test";

test.describe("E2E tests for RUC consultation", () => {
	test("should allow searching for a RUC and displaying details", async ({ page }) => {
		await page.goto("http://localhost:5173");

		await expect(page.locator('input[type="number"]')).toBeVisible();

		await page.fill('input[type="number"]', "10452159428");

		await expect(page.locator("h2")).toContainText("GARCIA CHANCO CARLOS AUGUSTO");
		await expect(page.locator('span >> text="10452159428"')).toBeVisible();
	});

	test("should show an error if the RUC is not valid", async ({ page }) => {
		await page.goto("http://localhost:5173");
		await page.fill('input[type="number"]', "12345678912");

		const consoleErrorPromise = new Promise((resolve) => {
			page.on("console", (msg) => {
				if (msg.type() === "error") {
					resolve(msg.text());
				}
			});
		});

		const errorMessage = await consoleErrorPromise;

		expect(errorMessage).toContain("Ruc not found");
	});
});
