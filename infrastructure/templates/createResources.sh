#!/bin/bash
branchName=$1
uniqueId=$(echo "$2" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-zA-Z0-9-_')
gdsAccount=$3

## ensures required parameters where entered.
if [ "$#" -eq  "0" ]
    then
      echo -e "Usage: ./createResourcesStack.sh <branchName> <uniqueId> <gds account>"
      exit 1
fi

cf=$(gds aws "$gdsAccount" --region eu-west-2 -- \
    aws cloudformation create-stack \
    --stack-name "$uniqueId"-idc-resources-stack \
    --template-body file://./resources.yaml \
    --capabilities CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM )
# output result to cli.
echo "$cf"
