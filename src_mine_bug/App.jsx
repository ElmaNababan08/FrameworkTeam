import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Calculator from './pages/Calculator';
import Playlists from './pages/Playlists'; // Pastikan path ini sesuai
import Movies from './pages/Movies'; // Pastikan path ini sesuai

function App() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/playlists" element={<Playlists />} /> {/* Rute untuk Playlists */}
            <Route path="/movies" element={<Movies />} /> {/* Rute untuk Movies */}
            {/* Default route (redirect to Dashboard) */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;