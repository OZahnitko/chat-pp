// const getInput = (): Promise<string> => {
//   const stdin = process.stdin;
//   stdin.setEncoding("utf8");

//   let data = "";

//   return new Promise((resolve, reject) => {
//     stdin.on("data", (chunk) => (data += chunk));

//     stdin.on("end", () => resolve(data));

//     stdin.on("error", () => reject);
//   });
// };

// (async () => {
//   try {
//     const input = await getInput();
//     console.log(JSON.parse(input));
//   } catch {
//     console.error();
//   }
// })();

(async () => {
  console.log(process.argv);
})();
