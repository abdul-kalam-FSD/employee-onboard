// Generates EMP-#### ids and the "created date" timestamp saved with
// every registration. The frontend must never send its own employeeId -
// the backend is the only source of truth for this value.

// NOTE: this counter lives in memory, so it resets whenever the server
// restarts. For a production setup, replace this with a call that reads
// the last row from the Google Sheet (via Apps Script) and increments
// from there, so ids stay sequential across restarts/deployments.
let currentId = Number(process.env.EMP_ID_START || 1000);

function generateEmployeeId() {
  currentId += 1;
  return `EMP-${currentId}`;
}

// Formats "now" as YYYY-MM-DD HH:mm:ss
function generateCreatedDate() {
  const now = new Date();

  const pad = (n) => String(n).padStart(2, "0");

  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return `${date} ${time}`;
}

export { generateEmployeeId, generateCreatedDate };
