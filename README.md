# AWS CodePipeline Synthetic Tests

The resources in this repository will help you setup required AWS resources
for building synthetic tests and use it to disable transitions in AWS CodePipeline. 

## Prerequisites

1. Create an AWS CodeCommit repository with any name of your preference using AWS console or CLI. This document assumes
that the name you chose is 'aws-codepipeline-synthetic-tests'. 
2. Clone the content of this repository to AWS CodeCommit repository created in the above step.
3. Download AWS CodeDeploy sample application for Linux using this [link](https://s3.amazonaws.com/aws-codedeploy-us-east-1/samples/latest/SampleApp_Linux.zip).
4. Upload this application in a version enabled Amazon S3 bucket you own. Note down both the bucket name and object key. 
You will need in later steps.
 
## Steps 
1. Clone this GitHub repository or AWS CodeCommit repository created above in your local workspace.
2. If you chose a different AWS CodeCommit repository name, replace `ParameterValue` in `setup-synthetic-tests-resources-stack-parameters.json` file with the name you chose.
3. Update `synthetic-tests-demo-resources-parameters.json` file to replace parameter values:
    * `CodeDeploySampleAppS3BucketName`: Amazon S3 bucket name from step 4 in Prerequisites section
    * `CodeDeploySampleAppS3ObjectKey` : The object key from step 4 in Prerequisites section
    * `KeyPairName`: Amazon EC2 key pair name
4. Create a new CloudFormation stack using AWS CloudFormation template `setup-synthetic-tests-resources-stack.yml` 
and parameter file `setup-synthetic-tests-resources-stack-parameters.json`. 
    * See this [article](https://aws.amazon.com/blogs/devops/passing-parameters-to-cloudformation-stacks-with-the-aws-cli-and-powershell/) for the details on how to pass parameters file using CLI.
5. Step 4 will create an AWS CodePipeline named `SetupSyntheticTestsDemoResources-Pipeline`. This pipeline will use 
  AWS CloudFormation integration with AWS CodePipeline to publish AWS Lambda functions to Amazon S3 and create a 
  new stack using template `synthetic-tests-demo-resources.yml` that contains actual AWS resources used in demo 
  including a new AWS CodePipeline named `SyntheticTestsDemoPipeline`. 
6. Above step will set up following things:
    * A new AWS CodePipeline named `SyntheticTestsDemoPipeline` with an AWS CodeDeploy Deploy stage.
    * AWS Lambda function that runs periodically to test the website created by Amazon CodeDeploy sample application
      and to send failure metrics to Amazon CloudWatch.
    * If the published metrics don't meet specified criteria, it triggers an Amazon CloudWatch alarm.
    * Amazon CloudWatch alarm sends notification to Amazon SNS topic which in turn invokes AWS Lambda function
      to disable the transition to Deploy stage in pipeline `SyntheticTestsDemoPipeline`.

## License

This plugin is open sourced and licensed under Apache 2.0. See the LICENSE file
for more information.