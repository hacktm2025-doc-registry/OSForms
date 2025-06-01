const {Engine} = require('bpmn-engine');
const { EventEmitter } = require('node:events');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '../examples/proces-simplu.bpmn'), 'utf8');

const engine = new Engine({
  name: 'MyProcessEngine',
  source
});

const listener = new EventEmitter();

listener.on('flow.take', (flow) => {
	console.log(`flow <${flow.id}> was taken`);
});

listener.on('wait', (task) => {
	console.log(`User task ${task.id} is being executed.`);
	if (task.id === 'usertaskSecretaryApproval') {
		task.signal({ "decision": "approve" });
		task.owner.environment.variables.decision = "approve";
	} else {
		task.signal({});
	}
	// console.log('Variables after signal:', task.owner.environment.variables);
});

listener.on('activity.start', (activity) => {
	console.log(`Starting activity ${activity.id}`);
	if (activity.id === 'secretaryDecision') {
		// console.log('Variables at gateway:', activity.environment.variables);
		const vars = activity.environment.variables;
		console.log(`Gateway '${activity.id}' started. decision =`, vars.decision, typeof vars.decision);
	}
});

engine.once('end', (execution) => {
	console.log(execution.environment.variables);
});

engine.execute(
	{
		listener,
	},
	(err) => {
		if (err) throw err;
	}
);
