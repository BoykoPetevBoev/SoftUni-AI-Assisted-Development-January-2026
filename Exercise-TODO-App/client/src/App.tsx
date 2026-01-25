import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from './components/Toast'
import { TasksPage } from './pages/TasksPage'
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
      <ToastProvider>
        <div className="app">
          <TasksPage />
        </div>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
