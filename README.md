# AWS CodePipeline Synthetic Tests

The resources in this repository will help you setup required AWS resources
for building synthetic tests and use it to disable transitions in AWS CodePipeline. 

## Prerequisites

1. Create an AWS CodeCommit repository with any name of your preference using AWS console or CLI. This document assumes that the name you chose is 'aws-codepipeline-synthetic-tests'.
2. Clone the content of this repository to AWS CodeCommit repository created in the above step. See this [article](http://docs.aws.amazon.com/codecommit/latest/userguide/how-to-migrate-repository.html) for details on cloning a GitHub repository to AWS CodeCommit.
3. Download AWS CodeDeploy sample application for Linux using this [link](https://s3.amazonaws.com/aws-codedeploy-us-east-1/samples/latest/SampleApp_Linux.zip).
4. Upload this application in a version enabled Amazon S3 bucket you own. Note down both the bucket name and object key. You will need in later steps.
5. Create an Amazon EC2 key pair if you don't have one already.

## Steps
Run following steps in the local workspace where GitHub repository was cloned:

1. If you chose a different AWS CodeCommit repository name, replace `ParameterValue` in `setup-synthetic-tests-resources-stack-parameters.json` file with the name you chose.
2. Update `synthetic-tests-demo-resources-parameters.json` file to replace parameter values:
    * `CodeDeploySampleAppS3BucketName`: Amazon S3 bucket name from step 4 in Prerequisites section
    * `CodeDeploySampleAppS3ObjectKey` : The object key from step 4 in Prerequisites section
    * `KeyPairName` : Amazon EC2 key pair name
    * `YourIP` : IP address to connect to SSH from. Check http://checkip.amazonaws.com/ to find yours.
3. Create a new CloudFormation stack using AWS CloudFormation template `setup-synthetic-tests-resources-stack.yml` and parameter file `setup-synthetic-tests-resources-stack-parameters.json`. See this [article](https://aws.amazon.com/blogs/devops/passing-parameters-to-cloudformation-stacks-with-the-aws-cli-and-powershell/) for the details on how to pass parameters file using CLI.

    ```
    aws cloudformation create-stack --stack-name  SetupSyntheticTestsDemoResourcesStack --template-body file://<The path to local workspace>/aws-codepipeline-synthetic-tests/setup-synthetic-tests-resources-stack.yml  --capabilities  CAPABILITY_IAM --parameters  file://<The path to local workspace>/aws-codepipeline-synthetic-tests/setup-synthetic-tests-resources-stack-parameters.json
    ```
4. Step 4 will create an AWS CodePipeline named `SetupSyntheticTestsDemoResources-Pipeline`. This pipeline will use AWS CloudFormation integration with AWS CodePipeline to publish AWS Lambda functions to Amazon S3 and create a new stack using template `synthetic-tests-demo-resources.yml` that contains actual AWS resources used in demo including a new AWS CodePipeline named `SyntheticTestsDemoPipeline`. 
5. Above step will set up following things:
    * A new AWS CodePipeline named `SyntheticTestsDemoPipeline` with an AWS CodeDeploy Deploy stage.
    * AWS Lambda function that runs periodically to test the website created by Amazon CodeDeploy sample application
      and to send failure metrics to Amazon CloudWatch.
    * If the published metrics don't meet specified criteria, it triggers an Amazon CloudWatch alarm.
    * Amazon CloudWatch alarm sends notification to Amazon SNS topic which in turn invokes AWS Lambda function
      to disable the transition to Deploy stage in pipeline `SyntheticTestsDemoPipeline`.

## Cleanup
When no longer required, please remember to delete the stacks using AWS CloudFormation console or CLI to avoid getting charged.

## License
This plugin is open sourced and licensed under Apache 2.0. See the LICENSE file
for more information.
