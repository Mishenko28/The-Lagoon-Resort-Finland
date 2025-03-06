import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom"

import RootLayout from "./layouts/RootLayout"
import Home from "./pages/Home"
import Accommodation from "./pages/Accommodation"
import Amenity from "./pages/Amenity"
import AboutUs from "./pages/AboutUs"
import Booking from "./pages/Booking"
import Gallery from "./pages/Gallery"
import ForUsersOnlyRoute from "./components/ForUsersOnlyRoute"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Error from "./components/Error"




const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<Error />} path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="accommodations" element={<Accommodation />} />
            <Route path="amenities" element={<Amenity />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="booking" element={<Booking />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="login" element={<ForUsersOnlyRoute component={<Login />} />} />
            <Route path="sign-up" element={<ForUsersOnlyRoute component={<SignUp />} />} />
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