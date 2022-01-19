const { exec: syncExec } = require("child_process");
const { promisify } = require("util");

const exec = promisify(syncExec);

const findChanges = async () => {
  const { stdout } = await exec(`
    cat changes.txt
  `);

  console.log(stdout);
};

findChanges();
