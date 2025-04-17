import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const animateArrow = (bool) => {
    if (bool) {
        return {
            transition: "all 0.3s",
            rotate: "90deg"
        }
    }
    return {
        transition: "all 0.3s",
    }
}

const UserManual = () => {
    const [navs, setNavs] = useState({
        overview: false,
        dashboard: false,
        configuration: false,
        utilities: false,
    })

    const [subNavs, setSubNavs] = useState({
        bookings: false,
        reports: false,
        rooms: false,
        amenities: false,
        gallery: false,
        about: false,
        archive: false,
        activity: false,
        database: false,
        users: false,
        admins: false
    })

    return (
        <div className="user-manual">
            <div className="manual-body">
                <h1 onClick={() => setNavs(p => ({ ...p, overview: !p.overview }))}><i style={animateArrow(navs.overview)} className="fa-solid fa-caret-right" />Overview</h1>
                <AnimatePresence>
                    {navs.overview &&
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0, padding: 0 }}
                            className="sub-body"
                        >
                            <div className="sub-body-item">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0, padding: 0 }}
                                    className="content-wrapper"
                                >
                                    <div className="page">
                                        <div className="content-text">
                                            <h3>Main Page</h3>
                                        </div>
                                        <img src="/user_manual/overview.PNG" />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
            <div className="manual-body">
                <h1 onClick={() => setNavs(p => ({ ...p, dashboard: !p.dashboard }))}><i style={animateArrow(navs.dashboard)} className="fa-solid fa-caret-right" />Dashboard</h1>
                <AnimatePresence>
                    {navs.dashboard &&
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0, padding: 0 }}
                            className="sub-body"
                        >
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, bookings: !p.bookings }))}><i style={animateArrow(subNavs.bookings)} className="fa-solid fa-caret-right" />Bookings</h2>
                                <AnimatePresence>
                                    {subNavs.bookings &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Navigations</h3>
                                                        <p>There are <b>7</b> navigations in bookings which are <b>Pending, Confirmed, Ongoing, Completed, No-Show, Cancelled,</b> and <b>Expired.</b></p>
                                                        <p>Each tab displays a number with a blue background, indicating the total count of bookings associated with that status.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings1.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Pending</h3>
                                                        <p>The Pending section contains reservation forms that have been submitted by guests through the guest page.</p>
                                                        <p>These forms are pending approval from the admin. To approve a reservation, click the <b>Confirm</b> button. This will open a popup window.</p>
                                                        <p> To reject a reservation, click the <b>Cancel</b> button. This will open a confirmation popup window</p>
                                                    </div>
                                                    <img src="/user_manual/bookings2.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Confirm Reservation (Pending)</h3>
                                                        <p>This window is the Confirm Reservation interface, used by the admin to finalize a guest's booking. It displays the guest's information, including name, gender, age, email address, and contact number. The reservation period is shown just below, along with the total number of nights.</p>
                                                        <p>An Available Rooms dropdown allows the admin to view room availability for the selected dates. Below that, the admin can choose the room type, assign a room number, and adjust the number of guests using the provided controls. A large plus button is available to add more rooms or booking options if needed.</p>
                                                        <p>Payment received field lets the admin enter the amount paid by the guest. Once all details are confirmed and the necessary payment is entered, the admin can click Confirm to finalize the reservation or Back to cancel or return to the previous screen.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings3.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Confirmed</h3>
                                                        <p>The Confirmed section holds reservations that have been approved from the <b>Pending</b> section. If a guest changes their mind, the admin can use the <b>Change</b> button to make adjustments. There's also an option to cancel the reservation if needed by clicking the <b>Cancel</b> button.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings4.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Change Reservation (Confirmed)</h3>
                                                        <p>This window is the Change Reservation interface, which allows the admin to modify an existing guest booking. It displays the guest's details, including name, gender, age, email address, and contact number. The reservation period is shown, along with the total number of nights.</p>
                                                        <p>An Available Rooms dropdown is provided to check room availability based on the selected dates. The admin can choose the room type, specify the number of rooms, and adjust the number of guests using the plus and minus buttons. A large plus button allows the admin to add additional room types or selections.</p>
                                                        <p>In the payment section, the total reservation amount is displayed along with the amount already paid and the remaining balance. An Add payment field is available for entering any additional payments made by the guest. At the bottom, the Save button confirms and applies the changes, while the Back button cancels the action or returns to the previous screen.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings5.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Ongoing</h3>
                                                        <p>This section contains ongoing reservations, indicating that the room is now ready and available for the guest who made the booking.</p>
                                                        <p>When the guest arrives, the admin can click the Showed button to mark the room as occupied. If the guest does not arrive, the admin can mark the reservation as a No-show by clicking the corresponding button. There is also a Change button available for making any necessary updates to the reservation.</p>
                                                        <p>Once the reservation is fulfilled, the admin can click the Complete button to open the Complete Reservation interface.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings6.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Complete Reservation (Ongoing)</h3>
                                                        <p>This window is the Complete Reservation interface, used by the admin to finalize a guest's booking.</p>
                                                        <p>In the payment section, the total reservation amount is displayed along with the amount already paid and the remaining balance. An additional charge field is available for entering any additional payments made by the guest. At the bottom, the Confirm button confirms and applies the changes, while the Back button cancels the action or returns to the previous screen.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings7.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Completed</h3>
                                                        <p>This section displays all completed reservations and serves as a history, organized and filtered by month.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings8.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>No-Show</h3>
                                                        <p>This section displays all no-show reservations and serves as a history, organized and filtered by month.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings9.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Cancelled</h3>
                                                        <p>This section displays all cancelled reservations and serves as a history, organized and filtered by month.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings10.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Expired</h3>
                                                        <p>This section displays all expired reservations and serves as a history, organized and filtered by month.</p>
                                                        <p>Expired reservations are bookings that have reached their start date without being confirmed.</p>
                                                    </div>
                                                    <img src="/user_manual/bookings11.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, reports: !p.reports }))}><i style={subNavs.reports ? { rotate: "90deg" } : null} className="fa-solid fa-caret-right" />Reports</h2>
                                <AnimatePresence>
                                    {subNavs.reports &&
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0, padding: 0 }}
                                            className="content-wrapper"
                                        >
                                            <div className="page">
                                                <div className="content-text">
                                                    <h3>Generate Reports</h3>
                                                    <p>The Report section provides options for generating daily, weekly, monthly, and yearly reports. A dropdown menu allows the admin to choose the type of report. Once a report type is selected, a calendar will appear for selecting the specific date range the report will be based on. After choosing the date, the admin can click the Generate button to create the report. The report is generated in PDF format and can be downloaded.</p>
                                                </div>
                                                <img src="/user_manual/reports1.PNG" />
                                            </div>
                                        </motion.div>
                                    }
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
            <div className="manual-body">
                <h1 onClick={() => setNavs(p => ({ ...p, configuration: !p.configuration }))}><i style={animateArrow(navs.configuration)} className="fa-solid fa-caret-right" />Configuration</h1>
                <AnimatePresence>
                    {navs.configuration &&
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0, padding: 0 }}
                            className="sub-body"
                        >
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, rooms: !p.rooms }))}><i style={animateArrow(subNavs.rooms)} className="fa-solid fa-caret-right" />Rooms</h2>
                                <AnimatePresence>
                                    {subNavs.rooms &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Settings</h3>
                                                        <p>The Create Room Type button is used to add a new room type. The admin can update the current down payment by clicking the Change Down Payment button, and adjust the check-in and check-out times using the Change Check-in and Out Hours option. A Sort dropdown is available to organize the rooms within each room type, and there’s also an option to switch the room layout view between card and table formats.</p>
                                                    </div>
                                                    <img src="/user_manual/rooms1.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Create Room Type UI</h3>
                                                        <p>Clicking the Create Room Type button opens this window. It requires the admin to enter the room name, rate, additional fee per extra person, maximum occupancy, a caption, and an image that will be displayed on the guest page.</p>
                                                    </div>
                                                    <img src="/user_manual/rooms2.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Room Type</h3>
                                                        <p>This interface displays the room types. Each room type has a button located at the top left corner. The image icon opens a window where the admin can view and edit the current image and caption. Next to it is a button that opens a dropdown with additional options. To edit a specific room, the admin can simply click on it, which will open a window showing the current room details for editing.</p>
                                                    </div>
                                                    <img src="/user_manual/rooms3.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Edit Room UI</h3>
                                                        <p>Clicking on a room opens this interface, allowing the admin to edit the room details. Once the changes are complete, the admin can click Save to apply them. There is also an option to Delete the room if needed.</p>
                                                    </div>
                                                    <img src="/user_manual/rooms4.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, amenities: !p.amenities }))}><i style={animateArrow(subNavs.amenities)} className="fa-solid fa-caret-right" />Amenities</h2>
                                <AnimatePresence>
                                    {subNavs.amenities &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Main UI</h3>
                                                        <p>This interface includes an Add button for creating a new amenity. A Sort dropdown is available to organize the list of amenities, and there's an option to switch between card and table layouts. Clicking on an amenity opens its corresponding edit interface.</p>
                                                    </div>
                                                    <img src="/user_manual/amenities1.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Edit Amenity UI</h3>
                                                        <p>Clicking on an amenity opens this interface, allowing the admin to edit the amenity details. Once the changes are complete, the admin can click Save to apply them. There is also an option to Delete the amenity if needed.</p>
                                                    </div>
                                                    <img src="/user_manual/amenities2.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, gallery: !p.gallery }))}><i style={animateArrow(subNavs.gallery)} className="fa-solid fa-caret-right" />Gallery</h2>
                                <AnimatePresence>
                                    {subNavs.gallery &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Add new picture UI</h3>
                                                    </div>
                                                    <img src="/user_manual/gallery1.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Gallery images</h3>
                                                    </div>
                                                    <img src="/user_manual/gallery2.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Edit Picture UI</h3>
                                                    </div>
                                                    <img src="/user_manual/gallery3.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Room Type images</h3>
                                                    </div>
                                                    <img src="/user_manual/gallery4.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, about: !p.about }))}><i style={animateArrow(subNavs.about)} className="fa-solid fa-caret-right" />About Us</h2>
                                <AnimatePresence>
                                    {subNavs.about &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Main UI</h3>
                                                    </div>
                                                    <img src="/user_manual/about1.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
            <div className="manual-body">
                <h1 onClick={() => setNavs(p => ({ ...p, utilities: !p.utilities }))}><i style={animateArrow(navs.utilities)} className="fa-solid fa-caret-right" />Utilities</h1>
                <AnimatePresence>
                    {navs.utilities &&
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0, padding: 0 }}
                            className="sub-body"
                        >
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, archive: !p.archive }))}><i style={animateArrow(subNavs.archive)} className="fa-solid fa-caret-right" />Archive</h2>
                                <AnimatePresence>
                                    {subNavs.archive &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Main UI</h3>
                                                    </div>
                                                    <img src="/user_manual/archive1.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, activity: !p.activity }))}><i style={animateArrow(subNavs.activity)} className="fa-solid fa-caret-right" />Activity Logs</h2>
                                <AnimatePresence>
                                    {subNavs.activity &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Main UI</h3>
                                                    </div>
                                                    <img src="/user_manual/activity1.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, database: !p.database }))}><i style={animateArrow(subNavs.database)} className="fa-solid fa-caret-right" />Database</h2>
                                <AnimatePresence>
                                    {subNavs.database &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Main UI</h3>
                                                    </div>
                                                    <img src="/user_manual/database1.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, users: !p.users }))}><i style={animateArrow(subNavs.users)} className="fa-solid fa-caret-right" />Users</h2>
                                <AnimatePresence>
                                    {subNavs.users &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Main UI</h3>
                                                    </div>
                                                    <img src="/user_manual/users1.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Add user UI</h3>
                                                    </div>
                                                    <img src="/user_manual/users2.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>User Details UI</h3>
                                                    </div>
                                                    <img src="/user_manual/users3.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                            <div className="sub-body-item">
                                <h2 onClick={() => setSubNavs(p => ({ ...p, admins: !p.admins }))}><i style={animateArrow(subNavs.admins)} className="fa-solid fa-caret-right" />Admins</h2>
                                <AnimatePresence>
                                    {subNavs.admins &&
                                        <>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0, padding: 0 }}
                                                className="content-wrapper"
                                            >
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Main UI</h3>
                                                    </div>
                                                    <img src="/user_manual/admin1.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Add New Admin UI</h3>
                                                    </div>
                                                    <img src="/user_manual/admin2.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Create Admin Invitation UI</h3>
                                                    </div>
                                                    <img src="/user_manual/admin3.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>System Email UI</h3>
                                                    </div>
                                                    <img src="/user_manual/admin4.PNG" />
                                                </div>
                                                <div className="page">
                                                    <div className="content-text">
                                                        <h3>Invite Options UI</h3>
                                                    </div>
                                                    <img src="/user_manual/admin5.PNG" />
                                                </div>
                                            </motion.div>
                                        </>
                                    }
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </div >
    )
}

export default UserManual