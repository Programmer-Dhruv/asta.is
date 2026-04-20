import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/navbar/Navbar'
import Landing from './pages/landing/Landing'
import Browse from './pages/browse/Browse'
import Genre from './pages/genre/Genre'
import Watch from './pages/watch/Watch'
import Top from './pages/top/Top'
import Upcoming from './pages/upcoming/Upcoming'
import MyList from './pages/mylist/MyList'
import Search from './pages/search/Search'
import Profile from './pages/profile/Profile'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/genre/:genreName" element={<Genre />} />
        <Route path="/top" element={<Top />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/watch/:animeId" element={<Watch />} />
        <Route path="/watch" element={<Navigate to="/watch/1" replace />} />
        <Route path="/mylist" element={<MyList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
