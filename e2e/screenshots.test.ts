import { test } from "@playwright/test";

const EXAMS = [
  { slug: "fast", label: "FAST" },
  { slug: "dvt", label: "DVT" },
  { slug: "cardiac-lung", label: "Cardiac/Lung" },
  { slug: "soft-tissue", label: "Soft Tissue" },
  { slug: "gallbladder", label: "Gallbladder" },
  { slug: "obstetric", label: "OB/Pelvic" },
];

for (const exam of EXAMS) {
  test(`${exam.label} renders and captures screenshot`, async ({ page }) => {
    await page.goto(`/${exam.slug}`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `e2e/screenshots/${exam.slug}-after.png`,
      fullPage: true,
    });
  });
}
