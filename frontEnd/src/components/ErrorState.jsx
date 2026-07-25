import { IconAlertCircle, IconAlertTriangle, IconRefresh } from './Icons'

export default function ErrorState({ onTryAgain, onEditDetails }) {
  return (
    <div id="errorState" className="state-card">
      <div className="state-icon error">
        <IconAlertCircle />
      </div>
      <h2>Submission Failed</h2>
      <p>We couldn&apos;t submit your registration at the moment. Please check your information and try again.</p>
      <div className="error-detail-box">
        <IconAlertTriangle />
        Something went wrong while submitting your details. Please try again in a few moments.
      </div>
      <div className="state-actions">
        <button className="btn btn-primary" id="tryAgainBtn" type="button" onClick={onTryAgain}>
          <IconRefresh />
          Try Again
        </button>
        <button className="btn btn-secondary" id="editDetailsBtn" type="button" onClick={onEditDetails}>
          Edit Details
        </button>
      </div>
    </div>
  )
}
