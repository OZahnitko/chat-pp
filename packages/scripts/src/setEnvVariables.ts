import { exec as execSync } from "child_process";
import { promisify } from "util";

const exec = promisify(execSync);

const UPDATED_FUNCTIONS: string[] = ["chat-message", "chat-broadcast"];

const setEnvVariables = async () => {
  const setEnvVariablesLogsRaw = await Promise.all(
    UPDATED_FUNCTIONS.map((functionName) =>
      exec(`
        echo "LAMBDA_FUNCTIONS_${functionName}=true" >> $GITHUB_ENV
      `)
    )
  );
  console.log(setEnvVariablesLogsRaw);
};

setEnvVariables();
