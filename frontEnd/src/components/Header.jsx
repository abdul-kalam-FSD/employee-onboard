import { IconBriefcaseLogo, IconHelp } from './Icons'

export default function Header() {
  return (
    <header className="site">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-logo">
            <IconBriefcaseLogo />
          </div>
          <div className="brand-text">
            <div className="brand-name">Company Name</div>
            <div className="brand-sub">Employee Onboarding</div>
          </div>
        </div>
        <div className="header-right">
          <button className="help-btn" type="button" aria-label="Get support">
            <IconHelp />
            Support
          </button>
        </div>
      </div>
    </header>
  )
}
