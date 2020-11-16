#!/bin/bash

set -eo pipefail

SAM_S3_BUCKET='aws-sam-cli-managed-default-samclisourcebucket-nasb5bg3gqv6'
aws s3 mb s3://${SAM_S3_BUCKET}

cd $(dirname $0) && cd ..

DIR_REPO_ROOT=$(pwd)
DIR_SAM_CONFIG="${DIR_REPO_ROOT}/sam-config"

echo "Creating DynamoDB table ..."
sam deploy --s3-bucket ${SAM_S3_BUCKET} -t ${DIR_SAM_CONFIG}/template-dynamodb.yml --config-file ${DIR_SAM_CONFIG}/samconfig-dynamodb.toml
test $? -eq 0 || (echo "DynamoDB table creation failed, exiting... " && exit 1)
echo "DynamoDB table created."

echo "Creating Lambdas ..."
sam deploy --s3-bucket ${SAM_S3_BUCKET} -t ${DIR_SAM_CONFIG}/template-lambdas.yml --config-file ${DIR_SAM_CONFIG}/samconfig-lambdas.toml
test $? -eq 0 || (echo "Lambdas creation failed, exiting... " && exit 1)
echo "Lambdas created."
