#!/bin/bash

set -eo pipefail

cd $(dirname $0) && cd ..

DIR_REPO_ROOT=$(pwd)
DIR_SCRIPTs="${DIR_REPO_ROOT}/scripts"
DIR_TEST_EVENTS="${DIR_REPO_ROOT}/test-events"
DIR_SAM_CONFIG="${DIR_REPO_ROOT}/sam-config"

declare -A lambdaFns

function prepareLambdaFnsList {
  templateFile=$1
  #grep -E "FunctionName|Handler" ${templateFile} | while IFS= read -r line
  ## http://mywiki.wooledge.org/BashFAQ/024
  while IFS= read -r line
  do
    if [[ ${line} =~ "FunctionName" ]]
    then
      function=$(echo ${line} | cut -d ' ' -f 2)
    else
      handler=$(echo ${line} | cut -d '/' -f 2 | cut -d '.' -f 1)
      lambdaFns["${function}"]="${handler}"
    fi
  done <<< $(grep -E "FunctionName|Handler" ${templateFile})
}

function testLambda {
  fnSource=${lambdaFns[$1]}
  responseFile="${DIR_TEST_EVENTS}/${fnSource}-response.json"
  payload=$(< ${DIR_TEST_EVENTS}/${fnSource}-test-event.json)
  aws lambda invoke --function-name $1 \
    ${responseFile} \
    --cli-binary-format raw-in-base64-out \
    --payload "${payload}"
}

prepareLambdaFnsList ${DIR_SAM_CONFIG}/template-lambdas.yml

while true
do
  echo "Lambda functions: ${!lambdaFns[@]}"
  read -p "Choose a lambda function: " lambdaFn
  testLambda ${lambdaFn}
done
