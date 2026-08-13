import axios from "axios";
import "dotenv/config";

// Pre-configured axios client that always talks to the Google Apps Script
// Web App. Express never touches Google Sheets directly - Apps Script is
// the only thing allowed to do that.
const appScriptClient = axios.create({
  baseURL: process.env.GOOGLE_SCRIPT_URL, // e.g. https://script.google.com/macros/s/xxxx/exec
  timeout: 25000, // 25s - Apps Script web apps can be slow to cold-start
  headers: {
    "Content-Type": "application/json",
  },
});

export default appScriptClient;
