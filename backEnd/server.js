import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "dotenv/config";

import employeeRoutes from "./routes/employeeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// Request logging (skip in production if you don't want noisy logs)
app.use(morgan("dev"));

// Body parser - lets us read req.body as JSON
app.use(express.json());

// Only allow the React (Vite) dev server to call this API
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);

// Health check
app.get("/", (req, res) => {
  res.send("Employee Onboarding API is running");
});

// Feature routes
app.use("/api/employees", employeeRoutes);

// 404 handler - must come after all real routes
app.use(notFound);

// Central error handler - must be registered last
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
