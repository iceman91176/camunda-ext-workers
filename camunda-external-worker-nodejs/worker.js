const {
  Client,
  logger,
  Variables,
  File
} = require("camunda-external-task-client-js");

// configuration for the Client:
//  - 'baseUrl': url to the Workflow Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: "http://localhost:8080/engine-rest", use: logger,workerId:'order-worker-01' };

// create a Client instance with custom configuration
const client = new Client(config);

// susbscribe to the topic: 'creditScoreChecker'
client.subscribe("orderWorker", async function({ task, taskService }) {
  // Put your business logic
  // get the process variable 'score'
  const score = task.variables.get("externalContact");

  // set a process variable 'winning'
  const processVariables = new Variables();
  processVariables.set("orderProcessed", true);
  // complete the task
  await taskService.complete(task, processVariables);
});
