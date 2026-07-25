import { IconCheckCircleLarge, IconUserPlus } from './Icons'

export default function SuccessState({ empId, createdDate, onRegisterAnother, onBackHome }) {
  return (
    <div id="successState" className="state-card">
      <div className="state-icon success">
        <IconCheckCircleLarge />
      </div>
      <h2>Registration Successful!</h2>
      <p>Your employee registration has been submitted successfully.</p>
      <p>Your details have been recorded and will be processed by the HR team.</p>

      <div className="id-date-row">
        <div className="emp-id-box">
          <span className="label">Employee ID</span>
          <span className="value" id="empIdValue">{empId}</span>
        </div>
        <div className="emp-id-box" id="createdDateBox">
          <span className="label">Created Date</span>
          <span className="value" id="createdDateValue">{createdDate}</span>
        </div>
      </div>
      <div className="save-note">Please save this ID for your records.</div>

      <div className="state-actions">
        <button className="btn btn-primary" id="registerAnotherBtn" type="button" onClick={onRegisterAnother}>
          <IconUserPlus />
          Register Another Employee
        </button>
        <button className="btn btn-secondary" id="backHomeBtn" type="button" onClick={onBackHome}>
          Back to Home
        </button>
      </div>
    </div>
  )
}
