import AppRouter from './app/router'
import './App.css'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">
          <span className="inline-flex items-center">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 mr-2 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
              <path d="M11 11h2v6h-2zm0-4h2v2h-2z" />
            </svg>
            Red Social
          </span>
          <span className="hidden sm:inline text-sm font-normal ml-2 opacity-75"></span>
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
