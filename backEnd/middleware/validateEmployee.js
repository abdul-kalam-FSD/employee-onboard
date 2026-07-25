import { sendError } from "../utils/response.js";

const WORK_MODES = ["WFH", "WFO", "Hybrid"];

// Validates req.body against the rules from the project spec.
// Runs before the controller - if anything fails, we respond with 400
// and never call next(), so the controller only ever sees clean data.
function validateEmployee(req, res, next) {
  console.log("Incoming Body:", req.body);
  const {
    fullName,
    email,
    phone,
    department,
    designation,
    joiningDate,
    workMode,
  } = req.body || {};
  const errors = [];

  // fullName: required, string, min 3 characters
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
    errors.push("fullName is required and must be at least 3 characters");
  }

  // email: required, valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    errors.push("email is required and must be a valid email address");
  }

  // phone: required, exactly 10 digits
  if (!phone || typeof phone !== "string" || !/^\d{10}$/.test(phone.trim())) {
    errors.push("phone is required and must be exactly 10 digits");
  } else if (/^(\d)\1{9}$/.test(phone.trim())) {
    errors.push("Invalid phone number.");
  }
  // department: required
  if (!department || typeof department !== "string" || !department.trim()) {
    errors.push("department is required");
  }

  // designation: required
  if (!designation || typeof designation !== "string" || !designation.trim()) {
    errors.push("designation is required");
  }

  // joiningDate: required, valid date
  if (!joiningDate || isNaN(Date.parse(joiningDate))) {
    errors.push("joiningDate is required and must be a valid date");
  } else {
    const selectedDate = new Date(joiningDate);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.push("Joining date cannot be in the past.");
    }
  }
  // workMode: required, must be Office | Remote | Hybrid
  if (!workMode || !WORK_MODES.includes(workMode)) {
    errors.push(
      `workMode is required and must be one of: ${WORK_MODES.join(", ")}`,
    );
  }

  if (errors.length > 0) {
    console.log("Validation Errors:", errors);

    return sendError(res, 400, "Validation Failed", errors);
  }
  next();
}

export default validateEmployee;
