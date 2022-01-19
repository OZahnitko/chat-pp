const { exec: syncExec } = require("child_process");
const { promisify } = require("util");

const exec = promisify(syncExec);

const findChanges = async () => {
  const { stdout } = await exec(`
    cat changes.txt
  `);

  console.log(
    "The following files have been modified since the last commit..."
  );
  console.log(stdout.split("\n"));
};

findChanges();
