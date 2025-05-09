import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import './App.css'
import PasswordManager from './Pass';
import AuthPage from './AuthPage';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
        <Route path="/mainpage" element={<PasswordManager />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
