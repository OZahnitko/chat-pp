import { filterChangedFiles, findChangedFiles } from "./determineChanges";

jest.mock("util", () => ({
  promisify: () => {
    const fn = jest
      .fn()
      .mockReturnValue({ stdout: "packages/script/index.ts" });
    return fn;
  },
}));

describe("Look for changes.", () => {
  test("Finds changed files.", async () => {
    expect(await findChangedFiles()).toStrictEqual([
      "packages/script/index.ts",
    ]);
  });

  test("Filter changed files.", () => {
    expect(filterChangedFiles(["packages/script/index.ts"])).toStrictEqual({
      packageChanges: ["script/index.ts"],
    });
  });
});
