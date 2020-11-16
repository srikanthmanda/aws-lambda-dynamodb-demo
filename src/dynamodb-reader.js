const AWS = require("aws-sdk");

const dynoDb = new AWS.DynamoDB();

exports.handler = async () => {
  const tableNameParam = { TableName: "cloudFormationDocsIndex" };
  const tableDescription = dynoDb.describeTable(tableNameParam).promise();
  const getItemParams = {
    TableName: "cloudFormationDocsIndex",
    Key: {
      group: { S: "ec2" },
      // "#resourceAttr": { "S": "vpc" } // does not work for getItem
      resource: { S: "vpc" },
    },
    ProjectionExpression: "#groupAttr, #resourceAttr, #fileAttr",
    ExpressionAttributeNames: {
      "#groupAttr": "group", // "group" is reserved keyword
      "#resourceAttr": "resource", // "resource"" is reserved keyword
      "#fileAttr": "file", // "file"" is reserved keyword
    },
  };
  const item = dynoDb.getItem(getItemParams).promise();
  const batchGetParams = {
    RequestItems: {
      cloudFormationDocsIndex: {
        Keys: [
          {
            group: {
              S: "ec2",
            },
            resource: {
              S: "vpc",
            },
          },
          {
            group: {
              S: "lambda",
            },
            resource: {
              S: "function",
            },
          },
        ],
        ProjectionExpression: "#groupAttr, #resourceAttr, #fileAttr",
        ExpressionAttributeNames: {
          "#groupAttr": "group",
          "#resourceAttr": "resource",
          "#fileAttr": "file",
        },
      },
    },
  };
  const batchItems = dynoDb.batchGetItem(batchGetParams).promise();
  const queryParams = {
    TableName: "cloudFormationDocsIndex",
    KeyConditionExpression:
      "#groupAttr = :g AND begins_with(#resourceAttr, :r)",
    FilterExpression: "contains(#fileAttr, :fileExtension)",
    ProjectionExpression: "#groupAttr, #resourceAttr, #fileAttr",
    ExpressionAttributeNames: {
      "#groupAttr": "group",
      "#resourceAttr": "resource",
      "#fileAttr": "file",
    },
    ExpressionAttributeValues: {
      ":g": { S: "lambda" },
      ":r": { S: "func" },
      ":fileExtension": { S: ".md" },
    },
  };
  const queryItems = dynoDb.query(queryParams).promise();
  const scanParams = {
    TableName: "cloudFormationDocsIndex",
    FilterExpression: "begins_with(#fileAttr, :filePrefix)",
    ProjectionExpression: "#groupAttr, #resourceAttr, #fileAttr",
    ExpressionAttributeNames: {
      "#groupAttr": "group",
      "#resourceAttr": "resource",
      "#fileAttr": "file",
    },
    ExpressionAttributeValues: {
      ":filePrefix": { S: "ec2" },
    },
  };
  const scanItems = dynoDb.scan(scanParams).promise();
  return JSON.stringify(
    await Promise.all([
      tableDescription,
      item,
      batchItems,
      queryItems,
      scanItems,
    ])
  );
};
