export const handler = async (event: any) => {
  console.log(event);

  return { statusCode: 200, body: "Data sent. Now it's all good in the hood." };
};
