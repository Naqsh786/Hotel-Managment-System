import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import GuestDashboard from "./pages/GuestDashboard";
import RoomsPage from "./pages/RoomsPage";
import GalleryPage from "./pages/GalleryPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NewsPage from "./pages/NewsPage";

import GuestLayout from "./layouts/GuestLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminRooms from "./pages/AdminPages/AdminRooms";
import AdminMessages from "./pages/AdminPages/AdminMessages";
import AdminBookings from "./pages/AdminPages/AdminBookings";
import AdminHomeSettings from "./pages/AdminPages/AdminHomeSettings";
import AdminReviews from "./pages/AdminPages/AdminReviews";
import AdminUsers from "./pages/AdminPages/AdminUsers";
import AdminStaff from "./pages/AdminPages/AdminStaff";
import AdminProfile from "./pages/AdminPages/AdminProfile";
import AdminFinancials from "./pages/AdminPages/AdminFinancials";
import AdminAddons from "./pages/AdminPages/AdminAddons";
import AdminSecurity from "./pages/AdminPages/AdminSecurity";
import StaffLayout from "./layouts/StaffLayout";
import StaffDashboard from "./pages/StaffPages/StaffDashboard";
import WalkInBooking from "./pages/StaffPages/WalkInBooking";
import StaffMonitor from "./pages/StaffPages/StaffMonitor";
import GuestManagement from "./pages/StaffPages/GuestManagement";
import ComplaintsApprovals from "./pages/StaffPages/ComplaintsApprovals";
import RoomStatusPage from "./pages/StaffPages/RoomStatusPage";
import BillingPage from "./pages/StaffPages/BillingPage";
import StaffTasks from "./pages/StaffPages/StaffTasks";
import RoomService from "./pages/StaffPages/RoomService";
import StaffSchedule from "./pages/StaffPages/StaffSchedule";
import FoodInventory from "./pages/StaffPages/FoodInventory";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import BookingPage from "./pages/BookingPage";
import ReviewsPage from "./pages/ReviewsPage";
import DashboardChat from "./components/DashboardChat";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";


import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "./Features/authSlice";
import { useSocket } from "./context/SocketContext";
import { useToast } from "./context/ToastContext";
import { fetchAllBookings } from "./Features/bookingSlice";
import { fetchDashboardStats } from "./Features/adminSlice";
import { fetchAdminMessages } from "./Features/messageSlice";
import { fetchAllRooms } from "./Features/roomSlice";
import { fetchAllServiceRequests } from "./Features/serviceRequestSlice";
import { fetchActiveChats } from "./Features/chatSlice";

function App() {
  const { darkMode } = useSelector((state) => state.theme);

  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (token) {
      dispatch(getProfile());
    }
  }, [dispatch, token]);
  const socket = useSocket();
  const { toast } = useToast();
  useEffect(() => {
    if (socket && user) {
      const role = user.role === 'admin' ? 'admin' : user.responsibility?.toLowerCase() || 'staff';
      socket.emit('join_room', { userId: user._id, role });

      socket.on('newBooking', (data) => {
        if (token) {
          dispatch(fetchAllBookings());
          dispatch(fetchDashboardStats());
          toast.info("New Booking", `Room ${data?.roomName || data?.room?.name || 'Unit'} has been booked`);
        }
      });
      
      socket.on('newMessage', (data) => {
        if (token) {
          dispatch(fetchAdminMessages({ page: 1, search: "" }));
          toast.info("New Message", `From: ${data?.name || 'Guest'}`);
        }
      });

      socket.on('roomStatusUpdate', (data) => {
        if (token) {
          dispatch(fetchAllRooms());
          toast.info("Room Updated", `${data?.name || 'A room'} status changed to ${data?.status}`);
        }
      });

      socket.on('statsUpdated', () => {
        if (token) {
          dispatch(fetchDashboardStats());
        }
      });

      socket.on('newServiceRequest', (data) => {
        if (token) {
          dispatch(fetchAllServiceRequests());
          toast.warning("Service Request", `New ${data?.type || ''} request received`);
        }
      });

      socket.on('receive_message', (data) => {
        if (token && user) {
          // Only show notification if message is from someone else
          const senderId = typeof data.sender === 'object' ? data.sender._id : data.sender;
          if (senderId !== user._id) {
            // If user is staff/admin, refresh active chats to update badge
            if (user.role !== 'user') {
              dispatch(fetchActiveChats());
            }
            toast.info("New Chat Message", `Message from ${data.sender?.name || 'Guest'}`);
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('newBooking');
        socket.off('newMessage');
        socket.off('roomStatusUpdate');
        socket.off('statsUpdated');
        socket.off('newServiceRequest');
      }
    };
  }, [socket, token, dispatch, toast]);

  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminHomeSettings />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="security" element={<AdminSecurity />} />
          <Route path="financials" element={<AdminFinancials />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="addons" element={<AdminAddons />} />
          <Route path="reservations" element={<AdminBookings />} />
          <Route path="chat" element={<DashboardChat />} />
          <Route path="*" element={<Navigate to="dashboard" />} />

        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="walk-in" element={<WalkInBooking />} />
          <Route path="monitor" element={<StaffMonitor />} />
          <Route path="guests" element={<GuestManagement />} />
          <Route path="rooms" element={<RoomStatusPage />} />
          <Route path="inventory" element={<RoomStatusPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="complaints" element={<ComplaintsApprovals />} />
          <Route path="approvals" element={<ComplaintsApprovals />} />
          <Route path="tasks" element={<StaffTasks />} />
          <Route path="room-service" element={<RoomService />} />
          <Route path="schedule" element={<StaffSchedule />} />
          <Route path="food-inventory" element={<FoodInventory />} />
          <Route path="chat" element={<DashboardChat />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>

        {/* Guest Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/bookings/:roomId" element={<BookingPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<GuestDashboard />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
