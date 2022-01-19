import { exec as syncExec } from "child_process";
import { promisify } from "util";

const exec = promisify(syncExec);

const findChangedFiles = async () => {
  const { stdout } = await exec(`
        cat changes.txt
    `);
  console.log("The following files have changed since the last commit...");
  console.log(stdout.split("\n").filter((path) => !!path));
};

findChangedFiles();
