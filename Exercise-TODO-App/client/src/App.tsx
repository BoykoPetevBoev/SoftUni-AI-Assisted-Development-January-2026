import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <h1>TODO App</h1>
        <p>Personal Task Management Application</p>
      </div>
    </QueryClientProvider>
  )
}

export default App
