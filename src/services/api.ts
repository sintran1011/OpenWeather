import { BASE_API, WEB_KEY } from "../utils/config/env";

export const API_KEYS = {
  WEATHER_API: "data/2.5/",
  GEO_API: "geo/1.0/direct",
};

export const API_PROXY = {
  BASE_API: BASE_API,
  WEATHER_API: BASE_API + API_KEYS.WEATHER_API,
  GEO_API: BASE_API + API_KEYS.GEO_API,
  WEB_KEY: WEB_KEY,
};
