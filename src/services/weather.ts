import {
  IRequestLocation,
  IRequestWeather,
  IResponseForecastWeather,
  IResponseLocation,
  IResponseWeather,
} from "@/models/weather";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_PROXY } from "./api";

const baseUrl = API_PROXY.BASE_API;
const weatherUrl = API_PROXY.WEATHER_API;
const geoUrl = API_PROXY.GEO_API;
const key = API_PROXY.WEB_KEY;

console.log(baseUrl);

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (build) => ({
    getCurrentWeather: build.query<IResponseWeather, IRequestWeather>({
      query: ({ lat, lon, units }) =>
        `${weatherUrl}weather?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`,
    }),
    get5Days3HoursForecast: build.query<
      IResponseForecastWeather,
      IRequestWeather
    >({
      query: ({ lat, lon, units }) =>
        `${weatherUrl}forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`,
    }),
    getLocationList: build.query<IResponseLocation[], IRequestLocation>({
      query: ({ location, limit = 5 }) =>
        `${geoUrl}?q=${location}&limit=${limit}&appid=${key}`,
    }),
  }),
});

export const {
  useLazyGetCurrentWeatherQuery,
  useLazyGetLocationListQuery,
  useLazyGet5Days3HoursForecastQuery,
} = weatherApi;
