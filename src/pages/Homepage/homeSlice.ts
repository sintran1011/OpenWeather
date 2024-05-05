import { IForecastWeatherByDate, IResponseLocation } from "@/models/weather";
import { createSlice } from "@reduxjs/toolkit";
import { weatherApi } from "../../services/weather";

export interface HomepageState {
  currentLocation: IResponseLocation;
  foreCastWeather: IForecastWeatherByDate[];
}

const initialState: HomepageState = {
  currentLocation: {
    country: "",
    lat: 0,
    lon: 0,
    name: "",
    state: "",
  },
  foreCastWeather: [],
};

export const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
  },
  extraReducers(build) {
    build.addMatcher(
      weatherApi.endpoints.get5Days3HoursForecast.matchFulfilled,
      (state, { payload }) => {
        const dateList: string[] = payload.list.map(
          (i) => i.dt_txt.split(" ")[0]
        );
        const removeDuplicate = new Set(dateList);
        const formater: any = [];
        removeDuplicate.forEach((i) => {
          const filter = payload.list.filter((date) => {
            return date.dt_txt.split(" ")[0] === i;
          });
          const forecastByDate = { date: i, forecast: filter };
          formater.push(forecastByDate);
        });
        state.foreCastWeather = formater;
      }
    );
  },
});

export const { setCurrentLocation } = homepageSlice.actions;
export default homepageSlice.reducer;
