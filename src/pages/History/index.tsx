import MainLayout from "../../components/layout/main-layout";
import React, { useEffect, useRef, useState } from "react";
import { removeDuplicateLocations } from "../../utils";
import { useLazyGetLocationListQuery } from "../../services/weather";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { IResponseLocation } from "@/models/weather";
import { useDispatch } from "react-redux";
import { setCurrentLocation } from "../Homepage/homeSlice";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [searchKey, setSearchKey] = useState<string>("");
  const [history, setHistory] = useState<IResponseLocation[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [
    getLocation,
    { data: location = undefined, isFetching: locationLoading = false },
  ] = useLazyGetLocationListQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const oldHistory = localStorage.getItem("history");

  const handleVisibleDropdown = (e: any) => {
    if (inputRef.current?.contains(e.target)) {
      return setVisible(true);
    } else {
      return setVisible(false);
    }
  };

  useEffect(() => {
    if (oldHistory) {
      const parseHistory = oldHistory ? JSON.parse(oldHistory) : [];
      setHistory(parseHistory);
    }
  }, []);

  const handleSearch = (e: any) => {
    e.stopPropagation();
    if (!searchKey) {
      setError("Field Required !");
      return false;
    }
    setError("");
    setVisible(true);
    const params = {
      location: searchKey,
      limit: 5,
    };
    getLocation(params);
  };

  const handleSaveHistory = (data: IResponseLocation[]) => {
    const removed = removeDuplicateLocations(data || []);
    const formater = JSON.stringify(removed);
    localStorage.setItem("history", formater);
  };

  const handleSelectLocation = (local: IResponseLocation) => {
    const newHistory = [local, ...history];
    handleSaveHistory(newHistory);
    setVisible(false);
    dispatch(setCurrentLocation(local));
    navigate("/");
  };

  const handleDeleteHistory = (index: number) => {
    const clone = [...history];
    clone.splice(index, 1);
    handleSaveHistory(clone);
    setHistory(clone);
  };

  const renderLocation = (arr: any) => {
    if (arr.length === 0 && !error)
      return <p className="text-red-500">Invalid country or city</p>;
    const result = removeDuplicateLocations(location || []);
    if (arr.length > 0 && visible) {
      return (
        <div className="bg-white border py-1 min-[320px]:w-[300px] min-[375px]:w-[269px] rounded-lg border-gray-300">
          {result.map((i, index) => {
            return (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectLocation(i);
                }}
                className="p-2 cursor-pointer hover:bg-blue-200 flex justify-between items-center"
              >
                <p>
                  {[i.name, i.state, i.country].filter(Boolean).join(" , ")}
                </p>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const renderHistory = () => {
    return (
      <div className="select-none">
        <p className="font-medium">Search History</p>
        <div className="bg-white py-2 shadow-md rounded-lg border border-gray-200 mt-3 max-h-[500px] overflow-auto mini-scrollbar">
          {history.length > 0 ? (
            history.map((i: IResponseLocation, index: number) => (
              <div
                className="px-4 py-3 hover:bg-blue-200 flex justify-between items-center"
                key={index}
              >
                <p>
                  {[i.name, i.state, i.country].filter(Boolean).join(" , ")}
                </p>
                <div className="flex items-center gap-2">
                  <SearchOutlined
                    onClick={() => {
                      const newHistory = [i, ...history];
                      handleSaveHistory(newHistory);
                      dispatch(setCurrentLocation(i));
                      navigate("/");
                    }}
                    className="text-[18px] cursor-pointer"
                  />
                  <DeleteOutlined
                    onClick={() => {
                      handleDeleteHistory(index);
                    }}
                    className="text-[18px] cursor-pointer"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="font-semibold px-4 py-3">No history</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div
        onClick={handleVisibleDropdown}
        className="w-full flex flex-col items-center gap-10"
      >
        <div className="flex mt-4 gap-3 min-[320px]:w-[300px] min-[375px]:w-[360px] select-none relative">
          <div className="absolute z-10 top-11 left-0">
            {error && <p className="text-red-500">{error}</p>}
            {location ? renderLocation(location) : null}
          </div>
          <input
            ref={inputRef}
            onChange={(e) => {
              if (locationLoading) return false;
              const value = e.target.value
                .split(" ")
                .filter((i) => !!i)
                .join(" ");
              setSearchKey(value);
            }}
            className="p-2 flex-1 rounded-md h-10 focus:outline-blue-600 border-gray-400 "
            placeholder="Search country or city here..."
            style={{
              opacity: locationLoading ? 0.5 : 1,
            }}
            autoFocus
            value={searchKey}
          />
          <button
            onClick={handleSearch}
            type="button"
            className="rounded-lg select-none w-fit h-10 bg-blue-600 text-white p-2 px-4"
          >
            <span className="text-center">Search</span>
          </button>
        </div>
        <div className="min-[320px]:w-[300px] min-[375px]:w-[360px]">
          {renderHistory()}
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
