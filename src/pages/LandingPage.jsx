// LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function LandingPage() {
  let navigate = useNavigate();
  const handleDOITBasicClick = () => {
    navigate("/DOITBaicFrame");
  };
  const handleDOITTextClick = () => {
    navigate("/DOITTextFrame");
  };
  const handleCheetoClick = () => {
    navigate("/CheetoFrame");
  };
  const handleHiddenClick = () => {
    navigate("/CelebrityFrame");
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-6">
      <h1 className="font-pretendard">프레임 테마 선택</h1>
      <div className="flex max-w-[768px] gap-4 h-3/4">
        <div
          onClick={handleDOITBasicClick}
          className="flex flex-col w-full h-full"
        >
          <img
            src="/frames/DOITBasicFrame/검정.png"
            alt="검정.png"
            className="h-5/6"
          ></img>
          <button className="w-full mt-4 h-1/6 btn btn-dark btn-lg !font-pretendard">
            두잇 기본 프레임
          </button>
        </div>
        <div
          onClick={handleDOITTextClick}
          className="flex flex-col w-full h-full"
        >
          <img
            src="/frames/DOITTextFrame/빨강_두잇_re.png"
            className="h-5/6"
            alt="검정_두잇_re.png"
          ></img>
          <button className="w-full mt-4 h-1/6 btn btn-secondary btn-lg !font-pretendard">
            두잇 글자 프레임
          </button>
        </div>
        <div
          onClick={handleCheetoClick}
          className="flex flex-col w-full h-full"
        >
          <img
            src="/frames/DOITCheetoFrame/치토2.png"
            alt="치토2.png"
            className="h-5/6"
          ></img>
          <button className="w-full mt-4 h-1/6 btn btn-primary btn-lg !font-pretendard">
            치토 프레임
          </button>
        </div>
      </div>
      <button
        onClick={handleHiddenClick}
        className="fixed bottom-0 right-0 opacity-0"
      >
        연애인 프레임
      </button>
    </div>
  );
}

export default LandingPage;
