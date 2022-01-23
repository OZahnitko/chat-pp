import {
  filterChangedFiles,
  findChangedFiles,
  findChangedPackages,
} from "./determineChanges";

let CHANGED_FILES = [
  ".github/workflows/chat-pp.yaml",
  ".gitignore",
  "packages/lambda-functions/chat-message/index.ts",
  "packages/lambda-functions/chat-message/sp.ts",
  "packages/lambda-functions/chat-broadcast/index.ts",
  "packages/lambda-functions/package.json",
  "packages/lambda-functions/scripts/buildFunctions.js",
  "packages/lambda-functions/scripts/build_chat-message.js",
  "packages/lambda-functions/scripts/deploy_chat-message.js",
  "packages/scripts/src/determineChanges.ts",
  "terraform/code_deploy.tf",
  "terraform/lambda.tf",
  "terraform/roles.tf",
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
      ".github/workflows/chat-pp.yaml",
      ".gitignore",
      "packages/lambda-functions/chat-message/index.ts",
      "packages/lambda-functions/chat-message/sp.ts",
      "packages/lambda-functions/chat-broadcast/index.ts",
      "packages/lambda-functions/package.json",
      "packages/lambda-functions/scripts/buildFunctions.js",
      "packages/lambda-functions/scripts/build_chat-message.js",
      "packages/lambda-functions/scripts/deploy_chat-message.js",
      "packages/scripts/src/determineChanges.ts",
      "terraform/code_deploy.tf",
      "terraform/lambda.tf",
      "terraform/roles.tf",
    ]);
  });

  test("Find changed packages", async () => {
    expect(findChangedPackages(await findChangedFiles())).toStrictEqual([
      "lambda-functions",
      "scripts",
    ]);
  });

  test("Filter changed files", async () => {
    expect(await filterChangedFiles()).toStrictEqual({
      packageChanges: {
        "lambda-functions": {
          functions: ["chat-broadcast", "chat-message"],
          layer: true,
        },
        scripts: {},
      },
    });
  });

  // test("Find changed packages", async () => {
  //   expect(findPackages(await findChangedFiles())).toStrictEqual({});
  // });

  // test("Filter changed files.", async () => {
  //   expect(filterChangedFiles(await findChangedFiles())).toStrictEqual({
  //     packageChanges: {
  //       "lambda-functions": {
  //         functions: ["chat-broadcast", "chat-message"],
  //         layer: true,
  //       },
  //       scripts: {},
  //     },
  //   });
  // });
});
