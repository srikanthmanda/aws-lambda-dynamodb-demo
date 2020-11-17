# Deployment Notes

This application was developed on a Windows 10 machine, using Bash shell for scripting various activities and Windows Subsystem for Linux (WSL) for deployment and testing.

However, the main code and templates should work in either Windows or Linux environments, using AWS and SAM CLI tools.

## Prerequisites

### AWS CLI

AWS CLI is needed for configuring AWS credentials and creating S3 bucket for code deployment.

Windows version:

```
PS beginning-aws-lambda> aws --version
aws-cli/1.18.113 Python/3.8.2 Windows/10 botocore/1.17.36
```

WSL version:

```
$ beginning-aws-lambda > aws --version
aws-cli/2.0.57 Python/3.9.0 Linux/4.4.0-18362-Microsoft source/x86_64.ubuntu.18
```

### SAM CLI

SAM CLI is needed to deploy the stacks and invoke Lambda functions.

Version (both Windows and WSL): v1.6.2.

```
sam --version
SAM CLI, version 1.6.2
```

### WSL

Ubuntu version:

```
$ ~ > uname -a
Linux pc 4.4.0-18362-Microsoft #1049-Microsoft Thu Aug 14 12:01:00 PST 2020 x86_64 x86_64 x86_64 GNU/Linux
```

Bash version:

```
$ ~ > bash --version
GNU bash, version 4.4.20(1)-release (x86_64-pc-linux-gnu)
```

## Scripts

The activities of building, deploying and running this application in Linux environment are all scripted.

The Bash shell scripts are located in `scripts` folder.

### Build

- File: [0-build.sh](../scripts/0-build.sh)
- Syntax: `./scripts/0-build.sh`

This script packages the application code by zipping `src` folder.

### Deploy

- File: [1-deploy.sh](../scripts/1-deploy.sh)
- Syntax: `./scripts/1-deploy.sh`

This script creates a S3 bucket to upload the code packaged in previous stage.

It then deploys all three stacks in the following order:

1. [lambdas-vpc](../sam-config/template-vpc.yml)
2. [dynamodb-table](../sam-config/template-dynamodb.yml)
3. [dynamodb-lambdas](../sam-config/template-lambdas.yml)

This script seeks user inputs. It prompts for deployment confirmation once after each of the three CloudFormation stacks' changesets are ready.

### Test

The script [2-test.sh](../scripts/2-test.sh) is built to test individual Lambda functions by invoking them synchronously using their corresponding payloads in `test-events` folder.

Steps:

```
$ aws-lambda-dynamodb-demo-dev > ./scripts/2-test.sh
Lambda functions: dynamoDbWriter dynamoDbReader
Choose a lambda function: dynamoDbWriter
{
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}
Lambda functions: dynamoDbWriter dynamoDbReader
Choose a lambda function: dynamoDbReader
{
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}
Lambda functions: dynamoDbWriter dynamoDbReader
Choose a lambda function: ^C
```

Once the test complete, abort the script using `Ctrl`+`C` keyboard command. Test event responses are written to `test-events` folder.

## Caveats

- S3 bucket names are global. So the deployment script will fail if the S3 bucket names used in the repo already exist. If that happens, simply changing the S3 bucket names in `SAM_S3_BUCKET` variable value in [1-deploy.sh](../scripts/1-deploy.sh) file should fix the issue.
- You may need to convert line-endings of these files from Windows (CR+LF) to Unix (LF) using `dos2unix` utility on WSL. Alternatively, you may also configure Git and other Windows tools to retain Unix line endings.
