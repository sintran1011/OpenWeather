export interface IRequestLocation {
  location: string;
  limit?: number;
}

export interface IResponseLocation {
  country: string;
  code?: string;
  lat: number;
  lon: number;
  name: string;
  state: string;
}

export interface IRequestWeather {
  lat: number;
  lon: number;
  units: string;
}

export interface IWeather {
  description: string;
  icon: string;
  id: number;
  main: string;
}

export interface IResponseWeather {
  main: {
    temp: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
  };
  visibility: number;
  wind: {
    deg: number;
    speed: number;
    gust: number;
  };
  weather: IWeather[];
}

export interface IForecast extends IResponseWeather {
  dt_txt: string;
}

export interface IForecastWeatherByDate {
  date?: string;
  forecast?: IForecast[];
}

export interface IResponseForecastWeather {
  list: IForecast[];
}
