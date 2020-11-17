# AWS Lambda DynamoDB Demo

This application demos basic operations on DynamoDB from AWS Lambda, using AWS JavaScript SDK.

## Notes

- DynamoDB does not support resource policies — https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/access-control-overview.html#access-control-manage-access-resource-based
- `Policies` property of `AWS::Serverless::Function` also allows SAM policy templates — https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-policy-templates.html 

## Appendix

- [Deployment Notes](notes/deployment.md): How to deploy and test this application.
- [VPC endpoint routing test](extras/dynamodb-vpc-endpoint-test.txt): A log file demonstrating Lambda error when the functions are associated with private subnet and the DynamoDB VPC endpoint is removed.