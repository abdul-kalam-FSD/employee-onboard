import appScriptClient from "../config/appscript.js";

// Turns a raw axios error into one of our typed errors (APPSCRIPT_ERROR /
// NETWORK_ERROR) so errorHandler.js can respond with the right status.
// Shared by every function in this file that calls Apps Script.
function classifyAxiosError(err) {
  if (err.type === "APPSCRIPT_ERROR" || err.type === "NETWORK_ERROR") {
    return err; // already classified - pass through
  }

  // axios error with no response at all -> the request never reached
  // Apps Script (DNS failure, timeout, offline, wrong URL, etc.)
  if (err.request && !err.response) {
    const networkError = new Error("Unable to reach Google Apps Script");
    networkError.type = "NETWORK_ERROR";
    return networkError;
  }

  // axios error with a response, but a non-2xx status code
  if (err.response) {
    const appScriptError = new Error(
      `Google Apps Script responded with status ${err.response.status}`,
    );
    appScriptError.type = "APPSCRIPT_ERROR";
    return appScriptError;
  }

  // Anything else - let the global error handler treat it as unknown
  return err;
}

// Registers a new employee by POSTing the payload to the Apps Script
// Web App, which appends a row to the "Employees" sheet.
//
// Only this file (the service layer) knows about the Apps Script client -
// controllers just call registerEmployee(payload) and get plain data back.
async function registerEmployee(payload) {
  try {
    const { data } = await appScriptClient.post("", payload);

    // Apps Script is expected to reply with { success: true } or
    // { success: false, message } - if it says it failed, treat that
    // as an Apps Script error rather than a generic success.
    if (!data || data.success !== true) {
      const appScriptError = new Error(
        (data && data.message) || "Google Apps Script reported a failure",
      );
      appScriptError.type = "APPSCRIPT_ERROR";
      throw appScriptError;
    }

    return data;
  } catch (err) {
    throw classifyAxiosError(err);
  }
}

// Asks Apps Script for the Employee ID in the last row of the sheet
// (e.g. "EMP-1004"), or null if the sheet has no employees yet.
// Called before generating a new id so ids stay sequential even after
// the Node server restarts.
async function getLastEmployeeId() {
  try {
    const { data } = await appScriptClient.get("");

    if (!data || data.success !== true) {
      const appScriptError = new Error(
        (data && data.message) || "Google Apps Script reported a failure",
      );
      appScriptError.type = "APPSCRIPT_ERROR";
      throw appScriptError;
    }

    return data.lastEmployeeId || null;
  } catch (err) {
    throw classifyAxiosError(err);
  }
}

export { registerEmployee, getLastEmployeeId };
