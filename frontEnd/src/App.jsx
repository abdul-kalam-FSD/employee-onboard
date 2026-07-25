import Header from './components/Header'
import Hero from './components/Hero'
import OnboardingForm from './components/OnboardingForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <div className="page">
        <Hero />
        <OnboardingForm />
      </div>
      <Footer />
    </>
  )
}
