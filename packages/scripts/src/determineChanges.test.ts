import { filterChangedFiles, findChangedFiles } from "./determineChanges";

const CHANGED_FILES = [
  "packages/scripts/index.ts",
  "packages/lambda-functions/chat-broadcast/index.ts",
  "packages/lambda-functions/chat-message/index.ts",
  "packages/lambda-functions/package.json",
];

jest.mock("util", () => ({
  promisify: () => {
    const fn = jest.fn().mockReturnValue({
      stdout: CHANGED_FILES.join("\n"),
    });
    return fn;
  },
}));

describe("Look for changes.", () => {
  test("Finds changed files.", async () => {
    expect(await findChangedFiles()).toStrictEqual([
      "packages/scripts/index.ts",
      "packages/lambda-functions/chat-broadcast/index.ts",
      "packages/lambda-functions/chat-message/index.ts",
      "packages/lambda-functions/package.json",
    ]);
  });

  test("Filter changed files.", async () => {
    expect(filterChangedFiles(await findChangedFiles())).toStrictEqual({
      packageChanges: {
        "lambda-functions": {
          functions: ["chat-broadcast", "chat-message"],
          layer: true,
        },
        scripts: {},
      },
    });
  });
});
