const { exec: syncPromise } = require("child_process");
const { promisify } = require("util");

const exec = promisify(syncPromise);
const FUNCTION_NAME = "chat-message";

const buildChatMessage = async () => {
  const { stdout: buildLogsRaw } = await exec(`
        rm -rf ./${FUNCTION_NAME}/build ./${FUNCTION_NAME}/function.zip
        cp package.json ./${FUNCTION_NAME}
        cp tsconfig.json ./${FUNCTION_NAME}
        cd ./${FUNCTION_NAME}
        yarn install 
        yarn build
        rm -rf node_modules package.json tsconfig.json yarn.lock
        cd ./build
        zip -r ../function.zip ./
    `);
  console.log(buildLogsRaw);
};

buildChatMessage();
