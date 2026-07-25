# Employee Onboarding - Backend

Express API for the Employee Onboarding React app. It validates submissions,
generates the employee ID and timestamp, then forwards the record to a
Google Apps Script Web App which appends a row to a Google Sheet.

```
React Frontend  ->  Express API  ->  Google Apps Script Web App  ->  Google Sheets
```

## Folder structure

```
employee-backend/
├── server.js                      entry point, wires everything together
├── package.json
├── .env                           local config (not committed)
├── .gitignore
├── config/
│   └── appscript.js                axios client pointed at the Apps Script URL
├── routes/
│   └── employeeRoutes.js           POST /api/employees/register
├── controllers/
│   └── employeeController.js       builds the payload, calls the service
├── services/
│   └── googleSheetService.js       talks to Apps Script, classifies errors
├── middleware/
│   ├── validateEmployee.js         request validation
│   ├── asyncHandler.js             wraps async controllers
│   └── errorHandler.js             notFound + central error handler
├── utils/
│   ├── response.js                 sendSuccess / sendError helpers
│   └── idGenerator.js              EMP-#### id + createdDate generator
├── google-apps-script/
│   └── Code.gs                     paste this into script.google.com
└── README.md
```

## 1. Install dependencies

```bash
cd employee-backend
npm install
```

## 2. Configure environment variables

Edit `.env`:

```
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/xxxxxxxx/exec
EMP_ID_START=1001
```

## 3. Set up the Google Sheet

1. Create a new Google Sheet.
2. Add a sheet (tab) named exactly `Employees`.
3. Add this header row:

   ```
   Employee ID | Full Name | Email | Phone | Department | Designation | Joining Date | Work Mode | Created Date
   ```

4. Copy the Spreadsheet ID out of the sheet's URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

## 4. Deploy the Google Apps Script

1. In the Sheet, go to **Extensions > Apps Script**.
2. Replace the default code with the contents of `google-apps-script/Code.gs`.
3. Paste your Spreadsheet ID into the `SPREADSHEET_ID` constant.
4. Click **Deploy > New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize the requested permissions.
6. Copy the generated `/exec` URL and paste it into `.env` as `GOOGLE_SCRIPT_URL`.

## 5. Run the backend

```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start
```

The API will be available at `http://localhost:5000`.

## 6. Test with Postman

`POST http://localhost:5000/api/employees/register`

Body (raw JSON):

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "department": "Engineering",
  "designation": "Frontend Developer",
  "joiningDate": "2026-08-01",
  "workMode": "Hybrid"
}
```

Expected success response (`201`):

```json
{
  "success": true,
  "message": "Employee Registered Successfully",
  "employeeId": "EMP-1001"
}
```

Expected validation failure (`400`), e.g. missing phone:

```json
{
  "success": false,
  "message": "Validation Failed",
  "errors": ["phone is required and must be exactly 10 digits"]
}
```

## 7. Connect the React frontend

In `OnboardingForm.jsx`, replace the simulated `setTimeout` submission with
a real `axios` call - see the snippet at the bottom of this README or the
inline comments in the component for exactly where to swap it in.

```jsx
import axios from 'axios'

async function attemptSubmit() {
  setSubmitted(true)
  const allValid = Object.values(validity).every(Boolean)

  if (!allValid) {
    setTimeout(scrollToFirstInvalid, 0)
    return
  }

  setLoading(true)
  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/employees/register',
      formData
    )
    setLoading(false)
    setEmpId(data.employeeId)
    setCreatedDate(new Date().toLocaleString()) // or read from backend if returned
    setView('success')
  } catch (err) {
    setLoading(false)
    setView('error')
  }
}
```

Don't forget to `npm install axios` in the frontend project.

## Error handling reference

| Situation                                   | Status | `message`         |
|----------------------------------------------|--------|--------------------|
| Bad/missing form fields                      | 400    | Validation Failed |
| Apps Script reachable but reports failure     | 502    | Google Apps Script Error |
| Apps Script/Sheets unreachable (network/DNS)  | 503    | Network Error     |
| Route that doesn't exist                      | 404    | Not Found - ...   |
| Anything else                                 | 500    | Unknown Error     |
