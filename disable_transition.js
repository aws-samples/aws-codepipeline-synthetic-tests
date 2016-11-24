/*
 * Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
var aws = require('aws-sdk');
var codepipeline = new aws.CodePipeline();

exports.handler = (event, context, callback) => {

  var params = {
    pipelineName: process.env.PIPELINE_NAME,
    stageName: process.env.STAGE_NAME,
    transitionType: "Inbound",
    reason: "Disabled because synthetic tests were failing"
  };

  codepipeline.disableStageTransition(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      callback("Unable to disable the transition. Error: " + JSON.stringify(err));
    } else {
      console.log(data); // successful response
      callback(null, "Successfully disabled the transition for parameters: " + JSON.stringify(params));
    }
  });
};
