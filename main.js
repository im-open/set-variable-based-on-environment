const core = require('@actions/core');

const currentEnvironment = core.getInput('current-environment');
const variableName = core.getInput('variable-name');
const devValue = core.getInput('dev-value');
const qaValue = core.getInput('qa-value');
const stageValue = core.getInput('stage-value');
const prodValue = core.getInput('prod-value');
const demoValue = core.getInput('demo-value');
const uatValue = core.getInput('uat-value');

if (!currentEnvironment || currentEnvironment.length === 0) {
  core.setFailed('The current-environment argument must be provided.');
  return;
}
if (!variableName || variableName.length === 0) {
  core.setFailed('The variable-name argument must be provided.');
  return;
}

let value = '';
let env = '';
let hasMatchingEnv = true;
let valueWasProvided = true;

switch (currentEnvironment.toLowerCase()) {
  case 'd':
  case 'dev':
  case 'development':
    value = devValue;
    env = 'Dev';
    valueWasProvided = devValue && devValue.length > 0;
    break;
  case 'q':
  case 'qa':
    value = qaValue;
    env = 'QA';
    valueWasProvided = qaValue && qaValue.length > 0;
    break;
  case 's':
  case 'stg':
  case 'stage':
    value = stageValue;
    env = 'Stage';
    valueWasProvided = stageValue && stageValue.length > 0;
    break;
  case 'p':
  case 'prod':
  case 'production':
    value = prodValue;
    env = 'Prod';
    valueWasProvided = prodValue && prodValue.length > 0;
    break;
  case 'o':
  case 'demo':
    value = demoValue;
    env = 'Demo';
    valueWasProvided = demoValue && demoValue.length > 0;
    break;
  case 'u':
  case 'uat':
    value = uatValue;
    env = 'UAT';
    valueWasProvided = uatValue && uatValue.length > 0;
    break;
  default:
    hasMatchingEnv = false;
    break;
}

if (hasMatchingEnv && valueWasProvided) {
  core.info(`The '${variableName}' output and environment variable will be set to the ${env} value: '${value}'.`);
} else if (hasMatchingEnv) {
  core.info(
    `The '${env}' environment was found but a value was not provided for it.  The '${variableName}' output and environment variable will be empty.`
  );
} else {
  core.info(
    `The '${currentEnvironment}' environment is not recognized.  The '${variableName}' output and environment variable will be empty.`
  );
}

core.setOutput(variableName, value);
core.exportVariable(variableName, value);
