import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import BottomNav from './BottomNav.jsx'

export default function AppShell() {
  return (
    <div>
      <Header />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
