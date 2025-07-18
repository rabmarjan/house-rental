import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import HomePage from './components/HomePage'
import SearchResults from './components/SearchResults'
import PropertyDetails from './components/PropertyDetails'
import AgentProfile from './components/AgentProfile'
import FurnitureMoving from './components/FurnitureMoving'
import UserDashboard from './components/UserDashboard'
import AgentDashboard from './components/AgentDashboard'
import AdminDashboard from './components/AdminDashboard'
import MapView from './components/MapView'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/agent/:id" element={<AgentProfile />} />
            <Route path="/furniture-moving" element={<FurnitureMoving />} />
            <Route 
              path="/dashboard" 
              element={
               <ProtectedRoute allowedUserTypes={['user']}>
                  <UserDashboard />
               </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent-dashboard" 
              element={
               <ProtectedRoute allowedUserTypes={['agent']}>
                  <AgentDashboard />
               </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedUserTypes={['user']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

