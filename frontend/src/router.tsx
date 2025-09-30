import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/shared/Layout'
import { Home } from '@/routes/Home'
import { About } from '@/routes/About'
import { Events } from '@/routes/Events'
import { EventDetail } from '@/routes/EventDetail'
import { Speakers } from '@/routes/Speakers'
import { SpeakerDetail } from '@/routes/SpeakerDetail'
import { Schedule } from '@/routes/Schedule'
import { Tickets } from '@/routes/Tickets'
import { Gallery } from '@/routes/Gallery'
import { Blog } from '@/routes/Blog'
import { BlogDetail } from '@/routes/BlogDetail'
import { Contact } from '@/routes/Contact'
import { Wedding } from '@/routes/Wedding'
import { Admin } from '@/routes/Admin'
import { Login } from '@/routes/Login'
import { Register } from '@/routes/Register'
import { Page } from '@/routes/Page'
import { ComingSoon } from '@/routes/ComingSoon'
import { NotFound } from '@/routes/NotFound'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="speakers" element={<Speakers />} />
        <Route path="speakers/:id" element={<SpeakerDetail />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="wedding" element={<Wedding />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={
          <ProtectedRoute requireAdmin={true}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="page/:slug" element={<Page />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

