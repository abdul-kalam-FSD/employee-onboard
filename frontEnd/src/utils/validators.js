export function validateFullName(value) {
  return value.trim().length >= 2
}

export function validateEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value.trim())
}

export function validatePhone(value) {
  const digits = value.replace(/[^\d]/g, '')
  return digits.length >= 7 && digits.length <= 15
}

export function validateDepartment(value) {
  return value !== ''
}

export function validateDesignation(value) {
  return value.trim().length >= 2
}

export function validateJoiningDate(value) {
  return value !== ''
}

export function validateWorkMode(value) {
  return value !== ''
}

export function generateEmpId() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return 'EMP-' + n
}

export function generateCreatedDate() {
  const now = new Date()
  return (
    now.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) +
    ' ' +
    now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  )
}

export function getMinJoiningDate() {
  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
  return minDate.toISOString().split('T')[0]
}
