// Generates EMP-#### ids and the "created date" timestamp saved with
// every registration. The frontend must never send its own employeeId -
// the backend is the only source of truth for this value.
//
// Ids are derived from the last row actually in the Google Sheet (via
// Apps Script's doGet), not from an in-memory counter - so they stay
// sequential even after the Node server restarts or redeploys.
import { getLastEmployeeId } from "../services/googleSheetService.js";

async function generateEmployeeId() {
  const lastEmployeeId = await getLastEmployeeId(); // e.g. "EMP-1004" or null

  if (!lastEmployeeId) {
    // No employees in the sheet yet - start from EMP_ID_START
    return `EMP-${Number(process.env.EMP_ID_START || 1000) + 1}`;
  }

  const lastNumber = Number(lastEmployeeId.replace("EMP-", ""));
  return `EMP-${lastNumber + 1}`;
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
