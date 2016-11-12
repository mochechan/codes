var Slack = require('slack-node');
 
webhookUri = "__uri___";
 
slack = new Slack();
slack.setWebhook(webhookUri);
 
slack.webhook({
  channel: "#mochechan",
  username: "webhookbot",
  text: "This is posted to #general and comes from a bot named webhookbot."
}, function(err, response) {
	console.log(err);
  console.log(response);
});
