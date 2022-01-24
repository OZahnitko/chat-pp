const { exec: syncPromise } = require("child_process");
const { writeFile: writeFileSync } = require("fs");
const { promisify } = require("util");

const { jsonHash } = require("./utils/hash");

const exec = promisify(syncPromise);
const writeFile = promisify(writeFileSync);

const changes = require("../../../changes.json");

let LATEST_FUNCTION_VERSIONS;

const updateFunctions = async () => {
  const res = await Promise.all(
    changes?.packageChanges?.["lambda-functions"]?.functions.map(
      async (newFunctionVersion) =>
        await exec(`
          cd ./${newFunctionVersion}
          aws lambda update-function-code \
            --function-name ${newFunctionVersion} \
            --zip-file fileb://function.zip
        `)
    )
  );
  console.log(res);
};

const publishVersions = async () => {
  const publishVersionResponses = await Promise.all(
    changes?.packageChanges?.["lambda-functions"]?.functions.map(
      async (newVersion) =>
        await exec(`
        aws lambda wait function-updated \
          --function-name ${newVersion}
        aws lambda publish-version \
            --function-name ${newVersion}
      `)
    )
  );

  console.log(publishVersionResponses);

  LATEST_FUNCTION_VERSIONS = publishVersionResponses.reduce((acc, val) => {
    const res = JSON.parse(val.stdout);
    return { ...acc, [res.FunctionName]: res.Version };
  }, {});
  console.log(LATEST_FUNCTION_VERSIONS);
};

const deployProd = async () => {
  let CURRENT_PROD_VERSIONS;
  await Promise.all(
    changes?.packageChanges?.["lambda-functions"]?.functions.map(
      async (newVersion) => {
        const { stdout } = await exec(`
        aws lambda wait function-updated \
          --function-name ${newVersion}
        aws lambda list-aliases \
            --function-name ${newVersion}
      `);

        CURRENT_PROD_VERSIONS = {
          ...CURRENT_PROD_VERSIONS,
          [newVersion]: JSON.parse(stdout).Aliases.find(
            (alias) => alias.Name === "prod"
          ).FunctionVersion,
        };
      }
    )
  );

  await Promise.all(
    Object.keys(CURRENT_PROD_VERSIONS).map(async (targetFunction) => {
      const appSpec = {
        Version: "0.0",
        Resources: [
          {
            [targetFunction]: {
              Type: "AWS::Lambda::Function",
              Properties: {
                Name: targetFunction,
                Alias: "prod",
                CurrentVersion: CURRENT_PROD_VERSIONS[targetFunction],
                TargetVersion: LATEST_FUNCTION_VERSIONS[targetFunction],
              },
            },
          },
        ],
      };

      await writeFile(
        `./${targetFunction}/DEPLOY_${targetFunction}.json`,
        JSON.stringify({
          applicationName: "chat_pp",
          deploymentGroupName: targetFunction,
          revision: {
            revisionType: "AppSpecContent",
            appSpecContent: {
              content: JSON.stringify(appSpec),
              sha256: jsonHash(JSON.stringify(appSpec)),
            },
          },
        })
      );

      const deployResponse = await exec(`
        cd ./${targetFunction}
        aws lambda wait function-updated \
          --function-name ${targetFunction}
        aws deploy create-deployment \
            --cli-input-json file://DEPLOY_${targetFunction}.json \
            --region us-east-1
      `);
      console.log(deployResponse);
    })
  );
};

const cleanup = async () => {
  await Promise.all(
    changes?.packageChanges?.["lambda-functions"]?.functions.map(
      async (functionName) =>
        await exec(`
          cd ./${functionName}
          rm -rf DEPLOY_${functionName}.json package-lock.json
        `)
    )
  );
};

(async () => {
  await updateFunctions();
  await publishVersions();
  await deployProd();
  await cleanup();
})();
