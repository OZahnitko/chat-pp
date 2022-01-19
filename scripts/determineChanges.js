const { exec: syncExec } = require("child_process");
const { promisify } = require("util");

const exec = promisify(syncExec);

const findChanges = async () => {
  const { stdout } = await exec(
    `git diff --name-only \`${{ github.event.before }}\`..\`${{ github.event.after }}\``
  );

  console.log(stdout);
};

findChanges();
