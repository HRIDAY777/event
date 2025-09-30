import { Router } from '@/router'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router />
      <Toaster />
    </div>
  )
}

export default App

