import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/authSlice";
import themeReducer from "../Features/themeSlice";
import roomReducer from "../Features/roomSlice";
import messageReducer from "../Features/messageSlice";
import adminReducer from "../Features/adminSlice";
import bookingReducer from "../Features/bookingSlice";
import reviewReducer from "../Features/reviewSlice";
import serviceRequestReducer from "../Features/serviceRequestSlice";
import addonReducer from "../Features/addonSlice";
import amenityReducer from "../Features/amenitySlice";
import foodReducer from "../Features/foodSlice";
import chatReducer from "../Features/chatSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    rooms: roomReducer,
    messages: messageReducer,
    admin: adminReducer,
    bookings: bookingReducer,
    reviews: reviewReducer,
    serviceRequests: serviceRequestReducer,
    chat: chatReducer,
    addons: addonReducer,
    amenities: amenityReducer,
    foods: foodReducer,
  },
});

export default store;
