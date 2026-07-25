import asyncHandler from "../middleware/asyncHandler.js";
import { registerEmployee } from "../services/googleSheetService.js";
import {
  generateEmployeeId,
  generateCreatedDate,
} from "../utils/idGenerator.js";
import { sendSuccess } from "../utils/response.js";

// POST /api/employees/register
// req.body has already passed through validateEmployee.js by the time
// it gets here, so we can trust the shape of the data.
const registerEmployeeController = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    department,
    designation,
    joiningDate,
    workMode,
  } = req.body;

  // Backend owns these two values - never trust them from the frontend.
  // generateEmployeeId looks up the last id in the Sheet, so it's async.
  const employeeId = await generateEmployeeId();
  const createdDate = generateCreatedDate();

  const payload = {
    employeeId,
    fullName,
    email,
    phone,
    department,
    designation,
    joiningDate,
    workMode,
    createdDate,
  };

  // Forward to Apps Script -> Google Sheets. Any failure here throws
  // and is caught by asyncHandler, which forwards to errorHandler.js.
  await registerEmployee(payload);

  return sendSuccess(res, 201, "Employee Registered Successfully", {
    employeeId,
    createdDate,
  });
});

export { registerEmployeeController };
