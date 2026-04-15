import Header from '../components/Header'
import Hero from '../components/Hero'
import InternshipFeatures from '../components/InternshipFeatures'
import ExploreCourses from '../components/ExploreCourses'
import ModesWeTrain from '../components/ModesWeTrain'
import HiringPartners from '../components/HiringPartners'
import WhyChooseUs from '../components/WhyChooseUs'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import CallbackModal from '../components/CallbackModal'

function Home() {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <Hero />
      <InternshipFeatures />
      <ExploreCourses />
      <ModesWeTrain />
      <WhyChooseUs />
      <HiringPartners />
      <FAQ />
      <Footer />
      <CallbackModal />
    </div>
  )
}

export default Home
