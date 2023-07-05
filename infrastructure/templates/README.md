# Deploying the AWS infrastructure for IDC

## Via the console.
* log into aws and switch role to the account to deploy.
* goto cloudformation
* create stack.
* select template ready, and upload.
* select the ./templates/resources.yaml
* Stack name co-digital-IDC-resources-stack
* Following parameters are used to ID resources and keep resources unique, as we will be using a 'shared' account, this will help id our components and for cost tracking, if that's a thing, also allows us to have 'dev' specific stacks for adding new features or if we go down the blue/green route.
* * BranchName:	main (github branch name)
* * ServiceName: co-digital-idc (project id, defaulted).
* * UniqueID: dev (can be anything just to id the stack and keep resource names unique)
* Acknowledge that this will create iam resources.
* create

This will create the Users and roles needed to run the pipeline.
Once this is set we can run the pipeline bootstrap.
```bash
chmod 755 ./createResourcesStack.sh
./createResourcesStack.sh <branchName> <uniqueId> <gds account>
```
eg
```
./pipeline-tools/createBootstrapStack.sh dev covid-inquiry-form-non-prod
```

## via bash script

