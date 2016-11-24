var http = require("http");
var aws = require("aws-sdk");
var cloudWatch = new aws.CloudWatch();

exports.handler = (event, context, callback) => {

  var options = {
    host: process.env.WEBSITE_URL,
    port: 80,
    path: '/'
  };

  var content = "";
  var req = http.request(options, function(res) {
    res.setEncoding("utf8");
    res.on("data", function(chunk) {
      content += chunk;
    });

    res.on("end", function() {
      evaluateContent(content);
    });
  });

  req.end();

  var evaluateContent = function(content) {
    if (content.indexOf("AWS CodePipeline") != -1) {
      emitCloudWatchMetrics(0);
    } else {
      emitCloudWatchMetrics(1);
    }
  };

  var buildMetricsParams = function(count) {
    return {
      MetricData: [{
        MetricName: process.env.METRIC_NAME,
        Timestamp: new Date,
        Value: count,
        Unit: "Count"
      }],
      Namespace: process.env.METRIC_NAMESPACE
    }
  };

  var emitCloudWatchMetrics = function(failure) {
    cloudWatch.putMetricData(buildMetricsParams(failure), function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        callback("Synthetic Test Failure");
      } else {
        console.log(data); // successful response
        callback(null, "Synthetic Test Successful");
      }
    });
  };
};
