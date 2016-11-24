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
