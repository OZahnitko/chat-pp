const { exec: syncPromise } = require("child_process");
const { writeFile: writeFileSync } = require("fs");
const { promisify } = require("util");

const exec = promisify(syncPromise);
const writeFile = promisify(writeFileSync);

const BRANCH = process.env.GITHUB_REF_NAME;
const FUNCTION_NAME = "chat-message";
let LATEST_FUNCTION_VERSION;

const updateLambdaFunction = async () => {
  const { stdout: updateLogs } = await exec(`
  rm -rf ./${FUNCTION_NAME}/build ./${FUNCTION_NAME}/function.zip
  cp package.json ./${FUNCTION_NAME}
  cp tsconfig.json ./${FUNCTION_NAME}
  cd ./${FUNCTION_NAME}
  yarn install
  yarn build
  rm -rf node_modules package.json tsconfig.json yarn.lock
  cd ./build
  zip -r ../function.zip ./
  cd ../
  aws lambda update-function-code \
    --function-name ${FUNCTION_NAME} \
    --zip-file fileb://function.zip
`);

  console.log(updateLogs);
};

const publishVersion = async () => {
  const { stdout: publishLogsRaw } = await exec(`
    aws lambda publish-version \
      --function-name ${FUNCTION_NAME}
  `);

  const publishLogs = JSON.parse(publishLogsRaw);
  console.log(publishLogs);
  LATEST_FUNCTION_VERSION = publishLogs.Version;
};

const deployProd = async () => {
  const { stdout: aliasesDataRaw } = await exec(`
    aws lambda list-aliases \
      --function-name ${FUNCTION_NAME}
  `);

  const aliasesData = JSON.parse(aliasesDataRaw);

  const CURRENT_PROD_VERSION = aliasesData.Aliases.find(
    (alias) => alias.Name === "prod"
  ).FunctionVersion;

  const appSpec = {
    Version: "0.0",
    Resources: [
      {
        [FUNCTION_NAME]: {
          Type: "AWS::Lambda::Function",
          Properties: {
            Name: FUNCTION_NAME,
            Alias: "prod",
            CurrentVersion: CURRENT_PROD_VERSION,
            TargetVersion: LATEST_FUNCTION_VERSION,
          },
        },
      },
    ],
  };

  await writeFile(
    `./${FUNCTION_NAME}/DEPLOY_${FUNCTION_NAME}.json`,
    JSON.stringify({
      applicationName: "chat_pp",
      deploymentGroupName: FUNCTION_NAME,
      revision: {
        revisionType: "AppSpecContent",
        appSpecContent: { content: JSON.stringify(appSpec) },
      },
    })
  );

  const { stdout: deploymentResponseRaw } = await exec(`
    cd ./${FUNCTION_NAME}
    aws deploy create-deployment \
      --cli-input-json file://DEPLOY_${FUNCTION_NAME}.json \
      --region us-east-1
  `);

  const deploymentResponse = JSON.parse(deploymentResponseRaw);
  console.log(deploymentResponse);
};

const cleanup = async () => {
  await exec(`
    cd ./${FUNCTION_NAME}
    rm -rf build DEPLOY_${FUNCTION_NAME}.json function.zip
  `);
};

(async () => {
  await updateLambdaFunction();
  await publishVersion();

  if (BRANCH === "main") {
    try {
      console.log(`On branch ${BRANCH}.`);
      console.log("Deploying new prod function version.");
      await deployProd();
      console.log("Done.");
    } catch {
      console.log("There was an error.");
      console.log("At this stage, don't ask me what it is.");
      console.log("Will try to engineer a way to figure that out some way.");
    }
  }
  try {
    console.log("Cleaning up!");
    await cleanup();
    console.log("Cleanup done.");
  } catch {
    console.log("Somehow I've messed this part up!");
  }

  console.log("ALL DONE!");
})();
