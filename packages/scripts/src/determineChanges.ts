import { exec as syncExec } from "child_process";
import { writeFile as syncWriteFile } from "fs";
import { promisify } from "util";

export const exec = promisify(syncExec);
export const writeFile = promisify(syncWriteFile);

export const findChangedFiles = async () => {
  const { stdout: changesLogsRaw } = await exec(`
    cat changes.txt
  `);
  console.log("The following files have changed since the last commit...");
  return changesLogsRaw.split("\n").filter((change) => !!change);
};

export const findChangedPackages = (changes: string[]): string[] => {
  return Array.from(
    new Set(
      changes
        .filter((change) => change.includes("packages"))
        .map((change) => change.split("/")[1])
    )
  );
};

type LambdaFunctionChanges = {
  functions: string[];
  layer: boolean;
};

export const determineLambdaFunctions = (
  packageChanges: string[]
): LambdaFunctionChanges => {
  return {
    functions: Array.from(
      new Set(
        packageChanges
          .map((change) => change.split("/").slice(1).join("/"))
          .filter((change) => change.includes("lambda-functions"))
          .filter((change) => change.split("/").length > 2)
          .filter((change) => change.split("/")[1] !== "scripts")
          .map((change) => change.split("/")[1])
          .sort()
      )
    ),
    layer: !!packageChanges
      .filter((change) => change.includes("lambda-functions"))
      .filter((change) => change.includes("package.json")).length,
  };
};

type packageChanges = {
  [key: string]: { functions?: string; layer?: boolean };
};

export const filterChangedFiles = async () => {
  const changedFiles = await findChangedFiles();
  const changedPackages = findChangedPackages(changedFiles);
  // await writeFile("./changes.json", JSON.stringify(changeData));
  // return changedPackages;
  return {
    packageChanges: changedPackages.reduce((acc, val) => {
      return {
        ...acc,
        [val]:
          val === "lambda-functions"
            ? determineLambdaFunctions(changedFiles)
            : {},
      };
    }, {} as packageChanges),
  };
};

//   if (changeData.packageChanges["lambda-functions"].functions.length) {
//     console.log("building functions");
//     const { stdout: buildLambdaFunctionsEnvRaw } = await exec(`
//       echo "::set-output name=BUILD_LAMBDA_FUNCTIONS::true"
//     `);
//     console.log(buildLambdaFunctionsEnvRaw);
//   }
//   if (changeData.packageChanges["lambda-functions"].layer) {
//     console.log("will build layer");
//     const { stdout: buildLambdaFunctionsLayerEnvRaw } = await exec(`
//       echo "::set-output name=BUILD_LAMBDA_FUNCTIONS_LAYER::true"
//     `);
//     console.log(buildLambdaFunctionsLayerEnvRaw);
//   }

const setEnv = async () => {
  const changes = await filterChangedFiles();
  await writeFile("./changes.json", JSON.stringify(changes));
  if (!!changes.packageChanges["lambda-functions"]?.functions?.length) {
    const { stdout: buildLambdaFunctionsEnvRaw } = await exec(`
      echo "::set-output name=BUILD_LAMBDA_FUNCTIONS::true"
    `);
    console.log(buildLambdaFunctionsEnvRaw);
  }
  if (!!changes.packageChanges["lambda-functions"]?.layer) {
    const { stdout: buildLambdaFunctionsLayerEnvRaw } = await exec(`
      echo "::set-output name=BUILD_LAMBDA_FUNCTIONS_LAYER::true"
    `);
    console.log(buildLambdaFunctionsLayerEnvRaw);
  }
};

setEnv();
// // export const findPackages = (changes: string[]) => {
// //   return Array.from(["hello"]);
// // };

// const determineLambdaFunctions = (packageChanges: string[]) => {
//   return {
//     functions: packageChanges
//       .filter((change) => change.includes("lambda-functions"))
//       .filter((change) => change.split("/").length > 2)
//       .map((change) => change.split("/")[1]),
//     layer: !!packageChanges
//       .filter((change) => change.includes("lambda-functions"))
//       .filter((change) => change.includes("package.json")).length,
//   };
// };

// export const filterChangedFiles = (
//   fileList: string[]
// ): { packageChanges: any } => {
//   const packageChanges = fileList
//     .filter((filePath) => filePath.includes("packages"))
//     .map((file) => file.split("/").slice(1).join("/"));

//   return {
//     packageChanges: findPackages(packageChanges).reduce((acc, val) => {
//       return {
//         ...acc,
//         [val]:
//           val === "lambda-functions"
//             ? determineLambdaFunctions(packageChanges)
//             : val === "scripts"
//             ? 1
//             : {},
//       };
//     }, {} as any),
//   };
// };

// (async () => {
//   const changes = await findChangedFiles();
//   console.log(changes);
//   console.log("The following files will require processing...");
//   const changeData = filterChangedFiles(changes);
//   await writeFile("./changes.json", JSON.stringify(changeData));
//   // const { stdout: outputLogsRaw } = await exec(`
//   //   echo "::set-output name=BUILD_LAMBDA_FUNCTIONS::true"
//   // `);
//   // const outputs = ["BUILD_LAMBDA_FUNCTIONS", "BUILD_LAMBDA_FUNCTIONS_LAYER"];

//   // console.log(outputLogsRaw);
//   // const responses = await Promise.all(
//   //   outputs.map((output) =>
//   //     exec(`
//   //       echo "::set-output name=${output}::true"
//   //     `)
//   //   )
//   // );
//   // responses.forEach(({ stdout }) => console.log(stdout));
//   if (changeData.packageChanges["lambda-functions"].functions.length) {
//     console.log("building functions");
//     const { stdout: buildLambdaFunctionsEnvRaw } = await exec(`
//       echo "::set-output name=BUILD_LAMBDA_FUNCTIONS::true"
//     `);
//     console.log(buildLambdaFunctionsEnvRaw);
//   }
//   if (changeData.packageChanges["lambda-functions"].layer) {
//     console.log("will build layer");
//     const { stdout: buildLambdaFunctionsLayerEnvRaw } = await exec(`
//       echo "::set-output name=BUILD_LAMBDA_FUNCTIONS_LAYER::true"
//     `);
//     console.log(buildLambdaFunctionsLayerEnvRaw);
//   }
// })();
