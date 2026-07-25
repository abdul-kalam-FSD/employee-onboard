import express from "express";
import { registerEmployeeController } from "../controllers/employeeController.js";
import validateEmployee from "../middleware/validateEmployee.js";

const router = express.Router();

// POST /api/employees/register
// validateEmployee runs first; only calls next() if the body is clean.
router.route("/register").post(validateEmployee, registerEmployeeController);

export default router;
