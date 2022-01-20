import { exec as syncExec } from "child_process";
import { promisify } from "util";

export const exec = promisify(syncExec);

export const findChangedFiles = async (): Promise<string[]> => {
  const { stdout } = await exec(`
        cat changes.txt
    `);

  console.log("The following files have changed since the last commit...");

  return stdout.split("\n").filter((path) => !!path);
};

export const filterChangedFiles = (
  fileList: string[]
): { packageChanges: string[] } => {
  const packageChanges = fileList
    .filter((filePath) => filePath.includes("packages"))
    .map((file) => file.split("/").slice(1).join("/"));

  return { packageChanges };
};

(async () => {
  const changes = await findChangedFiles();
  console.log(changes);
  console.log("The following files will require some processing...");
  console.log(filterChangedFiles(changes));
  const {} = await exec(`
    echo "::set-output name=BUILD_LAMBDA_FUNCTIONS::true"
  `);
  // console.log(stdout);
})();
