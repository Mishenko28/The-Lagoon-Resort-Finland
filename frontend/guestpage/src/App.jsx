import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom"

import RootLayout from "./layouts/RootLayout"
import Home from "./pages/Home"
import Accommodation from "./pages/Accommodation"
import Amenity from "./pages/Amenity"
import AboutUs from "./pages/AboutUs"
import Booking from "./pages/Booking"
import Gallery from "./pages/Gallery"
import NotRegisteredUserRoute from "./components/NotRegisteredUserRoute"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import Error from "./components/Error"
import MyBookings from "./pages/MyBookings"




const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<Error />} path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="accommodations" element={<Accommodation />} />
            <Route path="amenities" element={<Amenity />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="booking" element={<Booking />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="login" element={<NotRegisteredUserRoute component={<Login />} />} />
            <Route path="sign-up" element={<NotRegisteredUserRoute component={<SignUp />} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Route>
    )
)




const App = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default App