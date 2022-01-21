import { exec as syncExec } from "child_process";
import { writeFile as syncWriteFile } from "fs";
import { promisify } from "util";

export const exec = promisify(syncExec);
export const writeFile = promisify(syncWriteFile);

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
  console.log("The following files will require processing...");
  const changeData = filterChangedFiles(changes);
  await writeFile("./changes.json", JSON.stringify(changeData));
  const { stdout: outputLogsRaw } = await exec(`
  echo "::set-output name=BUILD_LAMBDA_FUNCTIONS::true"
  `);
  const outputs = ["BUILD_LAMBDA_FUNCTIONS", "BUILD_LAMBDA_FUNCTIONS_LAYER"];
  console.log(outputLogsRaw);
  const responses = await Promise.all(
    outputs.map((output) =>
      exec(`
        echo "::set-output name=${output}::true"
      `)
    )
  );
  responses.forEach(({ stdout }) => console.log(stdout));
})();
