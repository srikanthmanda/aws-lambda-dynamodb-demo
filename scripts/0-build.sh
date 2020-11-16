#!/bin/bash

set -eo pipefail

cd $(dirname $0) && cd ..

DIR_REPO_ROOT=$(pwd)
DIR_SAM_BUILD="${DIR_REPO_ROOT}/sam-build"

rm ${DIR_SAM_BUILD}/dynamodb-lambdas.zip || echo "No build files to delete"
zip -r ${DIR_SAM_BUILD}/dynamodb-lambdas.zip src

echo "Lambda functions source code packaged successfully."