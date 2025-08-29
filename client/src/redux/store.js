import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import authReducer from "./reducers/authReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});
