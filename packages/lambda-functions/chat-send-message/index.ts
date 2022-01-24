import AWS from "aws-sdk";

export const handler = async (event: any) => {
  console.log(event);
  console.log(event.body);
  console.log(typeof event.body);

  const apiGW = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  await apiGW
    .postToConnection({
      ConnectionId: JSON.parse(event.body).recipient,
      Data: JSON.parse(event.body).message,
    })
    .promise();

  return { statusCode: 200, body: "Data sent." };
};
