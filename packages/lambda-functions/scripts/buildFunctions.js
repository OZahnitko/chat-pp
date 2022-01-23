const { exec: syncPromise } = require("child_process");
const { promisify } = require("util");

const exec = promisify(syncPromise);

const branchName = process.env.GITHUB_REF_NAME;

const changes = require("../../../changes.json");

console.log(changes.packageChanges["lambda-functions"].functions);
console.log(branchName || "local");

const buildAllNewFunctions = async () => {
  changes.packageChanges["lambda-functions"].functions.forEach(
    (newFunctionVersion) => console.log(newFunctionVersion)
  );
  await Promise.all(
    changes.packageChanges["lambda-functions"].functions.map((newFunction) =>
      exec(`
        rm -rf ./${newFunction}/build ./${newFunction}/function.zip
        cp package.json ./${newFunction}
        cp tsconfig.json ./${newFunction}
        cd ./${newFunction}
        yarn install
        yarn build
        rm -rf node_modules package.json tsconfig.json yarn.lock
        cd ./build
        zip -r ../function.zip ./
      `)
    )
  );
  console.log("All done!");
};

buildAllNewFunctions();
