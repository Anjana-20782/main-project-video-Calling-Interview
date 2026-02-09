import { useState } from 'react';
import { Route, Routes,Navigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';

import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import { Toaster } from 'react-hot-toast';

function App() {
  // const [count, setCount] = useState(0)

  const {isSignedIn} = useUser();
  return (
    <>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
    </Routes>

    <Toaster toastOptions={{duration:3000}} />
    </>
  );
}

export default App;

//w, daisyui, react-router, react-host-toast, 
// todo : react-query aka tanstack query, axios

