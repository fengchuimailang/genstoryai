import { ErrorBoundary } from './components/ErrorBoundary';
import AppRouter from './router';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;