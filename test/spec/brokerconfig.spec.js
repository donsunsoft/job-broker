/*global beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit, waitsFor */
"use strict";

var path = require('path');
var fs = require('fs');

var modulePath = path.join(__dirname, "../../src/broker.js");
var brokerModule = require(modulePath);
//Create object in debug mode
var broker = new brokerModule.JobBroker(true);
var callResult;

function getTestFilePath(filename) {
	if(filename.charAt(0) === '/') {
		filename = filename.substring(1);
	}
	return path.join(__dirname, "../files/badconfig/" + filename);
}

function resultCheck() {
	return callResult !== undefined;
}

describe("Testing of the broker configuration module", function () {
  it("checks for error when config file is empty", function () {
	callResult = undefined;
	broker.load(getTestFilePath("empty.json"), function(result) {
		//Could not load JSON
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_CouldNotLoadJson.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when config file has no nodes", function () {
	callResult = undefined;
	broker.load(getTestFilePath("nonodes.json"), function(result) {
		//Worker module undefined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_WorkersNotSpecified.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when config file does not exist", function () {
	callResult = undefined;
	broker.load("randon", function(result) {
		//File not found
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_ConfigFileNotFound.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when workers node contains no workers", function () {
	callResult = undefined;
	broker.load(getTestFilePath("zeroworkers.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_NoWorkers.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a worker definition has no job-type", function () {
	callResult = undefined;
	broker.load(getTestFilePath("validbroker-jobtype-missing.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_JobTypeMissing.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a worker definition has no worker", function () {
	callResult = undefined;
	broker.load(getTestFilePath("workernodemissing.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_WorkerNodeMissing.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a worker definition's worker node has no worker-module", function () {
	callResult = undefined;
	broker.load(getTestFilePath("workernomodule.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_WorkerModuleMissing.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a worker node's worker-module does not exist", function () {
	callResult = undefined;
	broker.load(getTestFilePath("workerbadmodulename.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_WorkerModuleCouldNotBeLoaded.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error during worker module initialization", function () {
	callResult = undefined;
	broker.load(getTestFilePath("workerinitializeerror.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_WorkerModuleCouldNotBeInitialized.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a worker definition has no queue", function () {
	callResult = undefined;
	broker.load(getTestFilePath("noqueue.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_QueueNodeMissing.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a worker definition's queue node has no queue-module", function () {
	callResult = undefined;
	broker.load(getTestFilePath("noqueuemodule.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_QueueModuleMissing.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a queue node's queue-name does not exist", function () {
	callResult = undefined;
	broker.load(getTestFilePath("queuenoqueuename.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_QueueNameMissing.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a queue node's queue-name is invalid", function () {
	callResult = undefined;
	broker.load(getTestFilePath("badqueuename.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_QueueNameInvalid.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error when a queue node's queue-module does not exist", function () {
	callResult = undefined;
	broker.load(getTestFilePath("queuebadmodule.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_QueueModuleCouldNotBeLoaded.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for error during queue module initialization", function () {
	callResult = undefined;
	broker.load(getTestFilePath("queuebadinitialization.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_QueueModuleCouldNotBeInitialized.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks that for a queue with module M and name N (M,N) occurs only once in config", function () {
	callResult = undefined;
	broker.load(getTestFilePath("dupequeues.json"), function(result) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.brokerConfig_QueueDefinedTwice.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });

  it("checks for a valid configuration", function () {
	callResult = undefined;
	broker.load(getTestFilePath("good.json"), function(result, brokerObj) {
		//Workers node not defined
		expect(result.errorCode).toBe(result.errorCodes.none.errorCode);
		callResult = result;
	});
	waitsFor(resultCheck);
  });
});