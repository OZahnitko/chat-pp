const gimmeArgs = () => {
  console.log(process.argv);
  console.log(JSON.parse(process.argv[2]));
};

gimmeArgs();
