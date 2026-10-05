import Navbar from './components/navigation/Navbar'
import Footer from './components/footer/Footer'
import CustomCursor from './components/CustomCursor'
import SignatureExperience from './components/signature-experience/SignatureExperience'

function App() {
  return (
    <div
      className="min-h-screen font-sans text-[#111111]"
      style={{
        backgroundColor: '#F7F4F4',
        backgroundImage: 'linear-gradient(180deg, rgba(241,206,203,0.15) 0%, rgba(247,244,244,0) 300px)'
      }}
    >
      <CustomCursor />
      <Navbar />
      <main className="pt-24 min-h-[calc(100vh-6rem)] grid place-items-center">
        <h1 className="text-4xl font-display font-bold">Growthway</h1>
      </main>
      <SignatureExperience />
      <Footer />
    </div>
  )
}

export default App
