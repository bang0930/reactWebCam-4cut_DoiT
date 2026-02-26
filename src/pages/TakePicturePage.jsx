import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import {Modal, Spinner} from "react-bootstrap";
import QRCode from "qrcode.react";
import { useNavigate } from "react-router-dom";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_ID,
  secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
  region: process.env.REACT_APP_REGION,
});

const s3 = new AWS.S3();

function TakePicturePage({ studentID, selectedFrameSrc }) {
  const videoRef = useRef(null);
  const photoRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [s3URL, setS3URL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  let navigate = useNavigate();
  const [brightness, setBrightness] = useState(1);
  const [exposure, setExposure] = useState(1);

  useEffect(() => {
    getUserCamera();
  }, []);

  const getUserCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = videoRef.current;
        video.srcObject = stream;

        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const width = 1200;
  const height = width / 1.56;

  const takePicture = (index) => {
    const photo = photoRefs[index].current;
    const video = videoRef.current;

    photo.width = width;
    photo.height = height;

    const ctx = photo.getContext("2d");

    ctx.filter = `brightness(${brightness}) contrast(${exposure})`;
    ctx.drawImage(video, 0, 0, photo.width, photo.height);
  };

  const captureAndSaveImage = () => {
    const captureDiv = document.getElementById("capture-div");
    html2canvas(captureDiv).then((canvas) => {
      canvas.toBlob((blob) => {
        uploadToS3(blob);
      });
    });
    setShowModal(true);
  };

  const uploadToS3 = (blob) => {
    const params = {
      Bucket: "doit-4cut",
      Key: `${studentID}.png`,
      Body: blob,
      ContentType: "image/png",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Image uploaded success");

        setS3URL(data.Location);
      }
    });
  };

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="flex w-screen h-screen overflow-scroll !font-pretendard">
      <div className="w-[60%]">
        <video
            className="w-full"
            ref={videoRef}
            style={{ filter: `brightness(${brightness}) contrast(${exposure})`,transform: "scaleX(-1)" }}
        ></video>
        <div className="flex gap-4 p-3.5">
          <button
              onClick={() => takePicture(0)}
              className="container btn btn-primary btn-lg"
          >
            1번 사진찍기
          </button>
          <button
              onClick={() => takePicture(1)}
              className="container btn btn-primary btn-lg"
          >
            2번 사진찍기
          </button>
          <button
              onClick={() => takePicture(2)}
              className="container btn btn-primary btn-lg"
          >
            3번 사진찍기
          </button>
          <button
              onClick={() => takePicture(3)}
              className="container text-md btn btn-primary btn-lg"
          >
            4번 사진찍기
          </button>
        </div>
        <div className="flex gap-2 p-3.5">
          <Link to="/" className="container p-4 btn btn-light btn-lg border-gray-500 border-2">
            이전
          </Link>
          <button
              onClick={captureAndSaveImage}
              className="container p-4 btn btn-dark btn-lg"
          >
            완료
          </button>
        </div>
          <div className="mt-6 flex flex-col items-center">
              <label className="text-lg font-medium">밝기 조절: {brightness}</label>
              <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={brightness}
                  onChange={(e) => setBrightness(e.target.value)}
                  className="w-64 mt-2"
              />
              <label className="text-lg font-medium">조도 조절: {brightness}</label>
              <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={exposure}
                  onChange={(e) => setExposure(e.target.value)}
                  className="w-64 mt-2"
              />
          </div>
      </div>
        <div className="flex w-[40%] max-h-full">
            <div className="flex fixed right-0 w-auto h-full aspect-[218.828/654] justify-end" id="capture-div">
                {/*캔버스*/}
                <div className="fixed right-0 top-0 h-full w-auto aspect-[218.828/654] flex-col flex">
                    {photoRefs.map((photoRef, index) => (
                        <canvas
                            key={index}
                            ref={photoRef}
                            className="w-full h-[21.14%] -scale-x-100"
                        ></canvas>
                    ))}
                </div>
                {/*프레임*/}
                <img
                    src={selectedFrameSrc}
                    className="z-10 fixed right-0 top-0 h-full"
                    alt="Selected Frame"
                ></img>
            </div>
        </div>


      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>이미지 다운로드 QR</Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex flex-col items-center justify-center">
            {s3URL ? (
                <QRCode value={s3URL} size={256} />
            ) : (
                <Spinner size="w-16 h-16" color="border-blue-500" />
            )}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center justify-center w-full">
            <button
              onClick={handleSuccess}
              className="w-full ml-4 btn btn-success btn-lg d-flex align-items-center justify-content-center"
            >
              처음으로
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TakePicturePage;
