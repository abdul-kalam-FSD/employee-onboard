import { WORK_MODES } from '../utils/constants'
import { WORK_MODE_ICONS, IconCheckCircle, IconAlertCircle } from './Icons'

export default function WorkModeSelector({ value, onSelect, showError, errorMessage, containerRef }) {
  const handleKeyDown = (e, modeValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(modeValue)
    }
  }

  return (
    <div className="field" style={{ marginTop: 22 }} ref={containerRef}>
      <label>
        Work Mode <span className="req">*</span>
      </label>
      <div className="workmode-grid" id="workmodeGrid" role="radiogroup" aria-label="Work mode">
        {WORK_MODES.map((mode) => {
          const Icon = WORK_MODE_ICONS[mode.value]
          const selected = value === mode.value
          return (
            <div
              key={mode.value}
              className={`workmode-card${selected ? ' selected' : ''}`}
              data-value={mode.value}
              role="radio"
              aria-checked={selected}
              tabIndex={0}
              onClick={() => onSelect(mode.value)}
              onKeyDown={(e) => handleKeyDown(e, mode.value)}
            >
              <span className="workmode-check">
                <IconCheckCircle />
              </span>
              <span className="wm-icon">
                <Icon />
              </span>
              <span className="wm-title">{mode.title}</span>
              <span className="wm-desc">{mode.desc}</span>
            </div>
          )
        })}
      </div>
      <input type="hidden" id="workMode" name="workMode" value={value} readOnly />
      <span className={`workmode-error${showError ? ' show' : ''}`} id="err-workMode" role="alert">
        <IconAlertCircle />
        {errorMessage}
      </span>
    </div>
  )
}
