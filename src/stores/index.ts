import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "../services/weather";
import homeReducer from "../pages/Homepage/homeSlice";

export const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
    homepage: homeReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(weatherApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
