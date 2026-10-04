import Navbar from './components/navigation/Navbar'
import Hero from './components/hero/Hero'

function App() {
  return (
    <div
      className="min-h-screen font-sans text-gw-ink"
      style={{
        backgroundColor: '#FAF8F5',
        backgroundImage:
          'linear-gradient(180deg, rgba(92,158,49,0.06) 0%, rgba(250,248,245,0) 400px)',
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
