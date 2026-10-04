import Navbar from './components/navigation/Navbar'
import Hero from './components/hero/Hero'

function App() {
  return (
   <div
      className="min-h-screen font-sans text-[#111111]"
      style={{
        backgroundColor: '#F7F4F4',
        backgroundImage:
          'linear-gradient(180deg, rgba(241,206,203,0.15) 0%, rgba(247,244,244,0) 300px)',
      }}
    >
      <Navbar />

      <main>
        <Hero />
      </main>
    </div>
  )
}

export default App
