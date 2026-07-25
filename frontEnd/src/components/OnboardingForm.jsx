import { useEffect, useRef, useState } from "react";
import FormField from "./FormField";
import WorkModeSelector from "./WorkModeSelector";
import SuccessState from "./SuccessState";
import ErrorState from "./ErrorState";
import { DEPARTMENTS } from "../utils/constants";
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateDepartment,
  validateDesignation,
  validateJoiningDate,
  validateWorkMode,
  getMinJoiningDate,
} from "../utils/validators";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconDepartment,
  IconDesignation,
  IconCalendar,
  IconChevronDown,
  IconArrowRight,
  IconAlertCircle,
} from "./Icons";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  joiningDate: "",
  workMode: "",
};

const FIELD_ORDER = [
  "fullName",
  "email",
  "phone",
  "department",
  "designation",
  "joiningDate",
  "workMode",
];

export default function OnboardingForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("form"); // 'form' | 'success' | 'error'
  const [empId, setEmpId] = useState("--");
  const [createdDate, setCreatedDate] = useState("--");

  const cardWrapRef = useRef(null);
  const fieldRefs = useRef({});
  const minJoiningDate = useRef(getMinJoiningDate()).current;

  const validity = {
    fullName: validateFullName(formData.fullName),
    email: validateEmail(formData.email),
    phone: validatePhone(formData.phone),
    department: validateDepartment(formData.department),
    designation: validateDesignation(formData.designation),
    joiningDate: validateJoiningDate(formData.joiningDate),
    workMode: validateWorkMode(formData.workMode),
  };

  function fieldStatus(name) {
    if (validity[name]) return "valid";
    if (submitted) return "invalid";
    return "";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleWorkModeSelect(value) {
    setFormData((prev) => ({ ...prev, workMode: value }));
  }

  function scrollToCard() {
    if (cardWrapRef.current) {
      const top =
        cardWrapRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function scrollToFirstInvalid() {
    const firstInvalidField = FIELD_ORDER.find((name) => !validity[name]);
    if (firstInvalidField && fieldRefs.current[firstInvalidField]) {
      fieldRefs.current[firstInvalidField].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  // Real API call to backend (Node/Express -> Google Apps Script -> Sheets)
  async function attemptSubmit() {
    setSubmitted(true);
    const allValid = Object.values(validity).every(Boolean);

    if (!allValid) {
      setTimeout(scrollToFirstInvalid, 0);
      return;
    }

    setLoading(true);

    try {
      const apiBase = "https://employee-onboard.onrender.com";
      const res = await fetch(`${apiBase}/api/employees/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const body = await res.json();

      if (!res.ok || !body || body.success !== true) {
        setLoading(false);
        setView("error");
        return;
      }

      // Use authoritative values returned by the backend
      setEmpId(body.employeeId || "--");
      setCreatedDate(body.createdDate || "--");
      setLoading(false);
      setView("success");
    } catch (err) {
      setLoading(false);
      setView("error");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    attemptSubmit();
  }

  function resetForm() {
    setFormData(initialFormData);
    setSubmitted(false);
  }

  function handleClear() {
    resetForm();
    fieldRefs.current.fullName?.querySelector("input")?.focus();
  }

  function handleRegisterAnother() {
    resetForm();
    setView("form");
  }

  function handleBackHome() {
    setView("form");
  }

  function handleTryAgain() {
    setView("form");
    attemptSubmit();
  }

  function handleEditDetails() {
    setView("form");
  }

  useEffect(() => {
    scrollToCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  return (
    <div className="card-wrap" ref={cardWrapRef}>
      <div className="card">
        {view === "form" && (
          <div id="formState">
            <div className="card-head">
              <h2>Employee Registration</h2>
              <p>Please enter your details below.</p>
            </div>

            <form
              id="onboardForm"
              className="card-body"
              noValidate
              onSubmit={handleSubmit}
            >
              {/* SECTION 1 */}
              <div className="form-section">
                <div className="section-heading">
                  <span className="section-icon">
                    <IconUser />
                  </span>
                  <h3>Personal Information</h3>
                </div>
                <p className="section-desc">
                  Let&apos;s start with the basics.
                </p>

                <div className="field-row">
                  <FormField
                    id="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    icon={IconUser}
                    status={fieldStatus("fullName")}
                    errorMessage="Full name is required."
                    containerRef={(el) => (fieldRefs.current.fullName = el)}
                  />
                  <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    icon={IconMail}
                    status={fieldStatus("email")}
                    errorMessage="Please enter a valid email address."
                    containerRef={(el) => (fieldRefs.current.email = el)}
                  />
                </div>

                <div className="field-row" style={{ marginTop: 18 }}>
                  <FormField
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                    icon={IconPhone}
                    status={fieldStatus("phone")}
                    errorMessage="Please enter a valid phone number."
                    containerRef={(el) => (fieldRefs.current.phone = el)}
                  />

                  <div
                    className={`field${fieldStatus("department") ? " " + fieldStatus("department") : ""}`}
                    id="field-department"
                    ref={(el) => (fieldRefs.current.department = el)}
                  >
                    <label htmlFor="department">
                      Department <span className="req">*</span>
                    </label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <IconDepartment />
                      </span>
                      <select
                        id="department"
                        name="department"
                        aria-describedby="err-department"
                        value={formData.department}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select department
                        </option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <span className="select-chevron">
                        <IconChevronDown />
                      </span>
                    </div>
                    <span
                      className="error-msg"
                      id="err-department"
                      role="alert"
                    >
                      <IconAlertCircle />
                      Please select a department.
                    </span>
                  </div>
                </div>
              </div>

              <hr className="section-divider" />

              {/* SECTION 2 */}
              <div className="form-section">
                <div className="section-heading">
                  <span className="section-icon">
                    <IconDesignation />
                  </span>
                  <h3>Job Information</h3>
                </div>
                <p className="section-desc">
                  Tell us about your role and joining details.
                </p>

                <div className="field-row">
                  <FormField
                    id="designation"
                    label="Designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                    icon={IconDesignation}
                    status={fieldStatus("designation")}
                    errorMessage="Designation is required."
                    containerRef={(el) => (fieldRefs.current.designation = el)}
                  />

                  <div
                    className={`field${fieldStatus("joiningDate") ? " " + fieldStatus("joiningDate") : ""}`}
                    id="field-joiningDate"
                    ref={(el) => (fieldRefs.current.joiningDate = el)}
                  >
                    <label htmlFor="joiningDate">
                      Joining Date <span className="req">*</span>
                    </label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <IconCalendar />
                      </span>
                      <input
                        type="date"
                        id="joiningDate"
                        name="joiningDate"
                        aria-describedby="err-joiningDate"
                        value={formData.joiningDate}
                        min={minJoiningDate}
                        onChange={handleChange}
                      />
                    </div>
                    <span
                      className="error-msg"
                      id="err-joiningDate"
                      role="alert"
                    >
                      <IconAlertCircle />
                      Please select your joining date.
                    </span>
                  </div>
                </div>

                <WorkModeSelector
                  value={formData.workMode}
                  onSelect={handleWorkModeSelect}
                  showError={submitted && !validity.workMode}
                  errorMessage="Please select your work mode."
                  containerRef={(el) => (fieldRefs.current.workMode = el)}
                />
              </div>

              {/* ACTIONS */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  id="submitBtn"
                  disabled={loading}
                >
                  <span id="submitBtnLabel">
                    {loading ? "Submitting..." : "Submit Registration"}
                  </span>
                  {loading ? (
                    <span className="spinner" id="submitBtnIcon"></span>
                  ) : (
                    <span id="submitBtnIcon">
                      <IconArrowRight />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  id="clearBtn"
                  onClick={handleClear}
                >
                  Clear Form
                </button>
              </div>
              <p className="privacy-note">
                Your information will be securely submitted for employee
                onboarding purposes.
              </p>
            </form>
          </div>
        )}

        {view === "success" && (
          <SuccessState
            empId={empId}
            createdDate={createdDate}
            onRegisterAnother={handleRegisterAnother}
            onBackHome={handleBackHome}
          />
        )}

        {view === "error" && (
          <ErrorState
            onTryAgain={handleTryAgain}
            onEditDetails={handleEditDetails}
          />
        )}
      </div>
    </div>
  );
}
