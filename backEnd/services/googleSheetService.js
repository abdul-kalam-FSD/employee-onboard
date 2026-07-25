import appScriptClient from "../config/appscript.js";

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
        (data && data.message) || "Google Apps Script reported a failure"
      );
      appScriptError.type = "APPSCRIPT_ERROR";
      throw appScriptError;
    }

    return data;
  } catch (err) {
    // Already classified above - just rethrow.
    if (err.type === "APPSCRIPT_ERROR") throw err;

    // axios error with no response at all -> the request never reached
    // Apps Script (DNS failure, timeout, offline, wrong URL, etc.)
    if (err.request && !err.response) {
      const networkError = new Error("Unable to reach Google Apps Script");
      networkError.type = "NETWORK_ERROR";
      throw networkError;
    }

    // axios error with a response, but a non-2xx status code
    if (err.response) {
      const appScriptError = new Error(
        `Google Apps Script responded with status ${err.response.status}`
      );
      appScriptError.type = "APPSCRIPT_ERROR";
      throw appScriptError;
    }

    // Anything else - let the global error handler treat it as unknown
    throw err;
  }
}

export { registerEmployee };
