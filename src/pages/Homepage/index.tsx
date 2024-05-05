import { useEffect } from "react";
import MainLayout from "../../components/layout/main-layout";
import { useSelector, useDispatch } from "react-redux";
import {
  useLazyGet5Days3HoursForecastQuery,
  useLazyGetCurrentWeatherQuery,
} from "../../services/weather";
import {
  IForecast,
  IForecastWeatherByDate,
  IRequestWeather,
} from "@/models/weather";
import moment from "moment";
import { ArrowRightOutlined } from "@ant-design/icons";

const weatherColCss = "flex flex-col justify-center items-center";
const grayTextCss = "text-gray-400 font-semibold";
const boldTextCss = "text-black text-base font-bold";

const HomePage = () => {
  const dispatch = useDispatch();
  const { currentLocation, foreCastWeather } = useSelector(
    (state: any) => state.homepage
  );
  const [getCurrentWeather, { data: currentWeather }] =
    useLazyGetCurrentWeatherQuery();
  const [getForeCastWeather, { isFetching: loadingForeCast = false }] =
    useLazyGet5Days3HoursForecastQuery();
  const oldHistory = localStorage.getItem("history");
  const parseHistory = oldHistory ? JSON.parse(oldHistory) : [];

  const fetchWeather = (location: IRequestWeather) => {
    const params = {
      lat: location.lat,
      lon: location.lon,
      units: "metric",
    };
    getCurrentWeather(params);
    getForeCastWeather(params);
  };

  useEffect(() => {
    if (currentLocation) {
      fetchWeather(currentLocation);
    } else {
      fetchWeather(parseHistory);
    }
  }, []);

  const generateLinkImg = (icon: string | undefined) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const renderWeatherToday = () => {
    return (
      <div className="min-[320px]:w-[300px] min-[375px]:w-[360px] border border-gray-200 shadow-lg bg-white rounded-lg p-3 select-none">
        <p className="mb-4 font-semibold">{moment().format("LL")}</p>
        <div className="grid grid-cols-6 gap-6 p-4">
          <div className={`col-span-3 bg-blue-300 rounded-lg ${weatherColCss}`}>
            <img
              src={generateLinkImg(currentWeather?.weather[0]?.icon)}
              alt="weatherIcon"
            />
          </div>
          <div className={`col-span-3 ${weatherColCss}`}>
            <p className="text-4xl font-semibold">
              {currentWeather?.main?.temp}
              <span>&#176;C</span>
            </p>
            <p className="capitalize text-lg">
              {currentWeather?.weather[0]?.description}
            </p>
          </div>
          <div className={`col-span-2 ${weatherColCss}`}>
            <p className={grayTextCss}>Humidity</p>
            <p className={`${boldTextCss}`}>
              {currentWeather?.main?.humidity || 0} %
            </p>
          </div>
          <div className={`col-span-2 ${weatherColCss}`}>
            <p className={grayTextCss}>Wind</p>
            <p className={`${boldTextCss}`}>
              {currentWeather?.wind && currentWeather?.wind?.deg > 0 ? (
                <ArrowRightOutlined
                  style={{
                    rotate: `${currentWeather?.wind?.deg}deg`,
                  }}
                />
              ) : null}
              {currentWeather?.wind.speed || 0}{" "}
              <span className="font-medium">m/s</span>
            </p>
          </div>
          <div className={`col-span-2 ${weatherColCss}`}>
            <p className={grayTextCss}>Visibility</p>
            <p className={`${boldTextCss}`}>
              {(currentWeather?.visibility || 0) / 1000}{" "}
              <span className="font-medium">km</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderForecastByDate = (date?: string, forecast?: IForecast[]) => {
    const isToday = moment().isSame(date, "day");
    return (
      <>
        <p className={`${grayTextCss} mb-3`}>
          {isToday ? "Today" : moment(date).format("DD MMM")}
        </p>
        <div className="grid grid-cols-1 gap-2">
          {forecast && forecast.length > 0
            ? forecast.map((item, index) => {
                const url = `https://openweathermap.org/img/wn/${item?.weather[0]?.icon}.png`;
                return (
                  <div key={index} className="flex items-center gap-1">
                    <p className={`${boldTextCss} w-11`}>
                      {moment(item?.dt_txt).format("H:mm ")}
                    </p>
                    <div className="flex items-center">
                      <img src={url} alt="iconWeather" />
                      <span className={`${grayTextCss} text-sm tracking-wider`}>
                        {item?.main?.temp_min}/{item?.main?.temp_max}&#176;C
                      </span>
                    </div>
                    <p className={`flex-1 text-right ${boldTextCss}`}>
                      {item?.weather[0]?.description}
                    </p>
                  </div>
                );
              })
            : null}
        </div>
      </>
    );
  };

  const renderSkeleton = () => {
    if (loadingForeCast) {
      return ["1", "2", "3", "4", "5"].map((i) => (
        <div
          key={i}
          className="bg-gray-400 animate-pulse w-full h-10 rounded-lg"
        />
      ));
    } else {
      return foreCastWeather && foreCastWeather.length > 0
        ? foreCastWeather.map((i: IForecastWeatherByDate, index: number) => (
            <div key={index}>{renderForecastByDate(i.date, i.forecast)}</div>
          ))
        : "No data";
    }
  };

  const render5DaysForecast = () => {
    return (
      <div>
        <p className={`${boldTextCss} text-[18px] mb-2`}>
          5-day Forecast (3 Hours)
        </p>
        {foreCastWeather && foreCastWeather.le}
        <div className="min-[320px]:w-[300px] min-[375px]:w-[360px] border border-gray-200 shadow-lg bg-white rounded-lg p-3 select-none flex flex-col gap-6">
          {renderSkeleton()}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="w-full flex flex-col items-center justify-center gap-12 mt-4">
        {renderWeatherToday()}
        {render5DaysForecast()}
      </div>
    </MainLayout>
  );
};

export default HomePage;
