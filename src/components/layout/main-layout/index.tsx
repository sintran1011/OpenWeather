import React, { ReactNode, useEffect } from "react";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface IProps {
  children: ReactNode;
}

const MainLayout = ({ children }: IProps) => {
  const navigate = useNavigate();
  const { currentLocation } = useSelector((state: any) => state.homepage);
  const oldHistory = localStorage.getItem("history");
  const parseHistory = oldHistory ? JSON.parse(oldHistory) : [];

  useEffect(() => {
    if (!currentLocation.name && parseHistory.length === 0) {
      navigate("/history");
    }
  }, []);

  return (
    <>
      <div className="p-4 flex justify-center items-center shadow-lg select-none">
        <div className="flex justify-between items-center cursor-pointer w-[360px]">
          <div className="flex items-center gap-1">
            <EnvironmentOutlined />
            <p
              onClick={() => {
                navigate("/");
              }}
              className="text-[22px] font-bold"
            >
              {currentLocation?.name || parseHistory[0]?.name}
            </p>
          </div>
          <SearchOutlined
            onClick={() => {
              navigate("/history");
            }}
            className="text-[22px]"
          />
        </div>
      </div>
      <div className="bg-gray-300 p-4 min-h-[calc(100vh-56px)] w-full">
        {children}
      </div>
    </>
  );
};

export default MainLayout;
