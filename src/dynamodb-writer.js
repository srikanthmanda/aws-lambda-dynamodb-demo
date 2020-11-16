const AWS = require("aws-sdk");

const dynoDb = new AWS.DynamoDB();

exports.handler = async (event) => {
  const responses = [];
  const putItem0Params = {
    TableName: "cloudFormationDocsIndex",
    Item: event[0],
    ConditionExpression: "attribute_not_exists(#groupAttr)",
    ExpressionAttributeNames: {
      "#groupAttr": "group",
    },
    ReturnValues: "ALL_OLD",
  };
  responses.push(await dynoDb.putItem(putItem0Params).promise());
  const putItemParams = {
    TableName: "cloudFormationDocsIndex",
    Item: event[0],
    ConditionExpression:
      "#groupAttr = :groupValue AND begins_with(#resourceAttr, :resourceValue) AND contains(#fileAttr, :fileExtension)",
    ExpressionAttributeNames: {
      "#groupAttr": "group",
      "#resourceAttr": "resource",
      "#fileAttr": "file",
    },
    ExpressionAttributeValues: {
      ":groupValue": { S: "ec2" },
      ":resourceValue": { S: "vpc" },
      ":fileExtension": { S: ".md" },
    },
    ReturnValues: "ALL_OLD",
  };
  responses.push(await dynoDb.putItem(putItemParams).promise());
  const deleteItemsParams = {
    TableName: "cloudFormationDocsIndex",
    Key: {
      group: { S: "ec2" },
      resource: { S: "vpc" },
    },
    ConditionExpression: "attribute_exists(#groupAttr)",
    ExpressionAttributeNames: {
      "#groupAttr": "group",
    },
    ReturnValues: "ALL_OLD",
  };
  responses.push(await dynoDb.deleteItem(deleteItemsParams).promise());
  const batchWriteParams = {
    RequestItems: {
      cloudFormationDocsIndex: event.map((el) =>
        Object.assign({}, { PutRequest: { Item: el } })
      ),
    },
  };
  responses.push(await dynoDb.batchWriteItem(batchWriteParams).promise());
  return JSON.stringify(responses);
};
