import { IconAlertCircle } from './Icons'

export default function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  icon: Icon,
  status, // '' | 'valid' | 'invalid'
  errorMessage,
  required = true,
  containerRef,
}) {
  return (
    <div className={`field${status ? ' ' + status : ''}`} id={`field-${id}`} ref={containerRef}>
      <label htmlFor={id}>
        {label} {required && <span className="req">*</span>}
      </label>
      <div className="input-wrap">
        <span className="input-icon">
          <Icon />
        </span>
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-describedby={`err-${id}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
      <span className="error-msg" id={`err-${id}`} role="alert">
        <IconAlertCircle />
        {errorMessage}
      </span>
    </div>
  )
}
