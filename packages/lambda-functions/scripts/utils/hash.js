const { createHash } = require("crypto");

const jsonHash = (string) => {
  let hashValue;
  const hash = createHash("sha256");
  hash.on("readable", () => {
    const data = hash.read();
    if (data) {
      hashValue = data.toString("hex");
    }
  });
  hash.write(string);
  hash.end();
  return hashValue;
};

module.exports = { jsonHash };
