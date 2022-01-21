const { exec: syncExec } = require("child_process");
const { promisify } = require("util");

const exec = promisify(syncExec);

(async () => {
  const { stdout } = await exec(`
    echo '${JSON.stringify({
      message: "Is in the bottle.",
    })}' | jq . | node testMeMore.js
  `);
  console.log(stdout);
})();
