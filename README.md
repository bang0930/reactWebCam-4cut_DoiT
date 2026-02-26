# 📸 Do-iT 4-Cut (아주대학교 축제 네컷사진)

> **"축제의 순간을 영원히"**
> 2023~2024년 **아주대학교 IT 동아리 Do-iT** 축제 부스 운영을 위해 개발된 웹 기반 네 컷 사진 서비스입니다.
<img width="330" height="992" alt="KakaoTalk_20260104_223055222" src="https://github.com/user-attachments/assets/12c0949e-cdbe-491b-91fb-e1f2e41f1767" />



<br/>

## 📖 프로젝트 배경 (Background)

이 프로젝트는 **아주대학교 축제** 기간 동안 학우들이 별도의 비용이나 앱 설치 없이, 친구들과의 소중한 추억을 남길 수 있도록 기획되었습니다.

IT 동아리 **'Do-iT'** 부스에서 노트북과 웹캠만으로 운영할 수 있도록 기존의 오프라인 포토부스(인생네컷) 경험을 웹 기술로 구현했습니다.
특히 **AWS S3와 QR 코드**를 활용한 즉시 전송 시스템을 도입하여 대기 시간을 줄였으며, 축제 당일 **약 100명** 이상의 학우들이 참여하여 성공적으로 운영되었습니다.

<br/>

## ✨ 핵심 기능 (Core Features)

* **📸 수동 4컷 촬영**: 타이머 방식 대신, 사용자가 원하는 타이밍에 '촬영 버튼'을 눌러 4장의 사진을 각각 촬영
* **🎛️ 실시간 필터 조절**: 현장 조명 상황에 맞춰 **밝기(Brightness)**와 **대비(Contrast)**를 슬라이더로 즉석에서 보정
* **🖼️ 프레임 합성**: `Canvas`와 `z-index` 레이어링을 통해 사진 위에 학교 축제 테마 프레임을 오버레이
* **☁️ AWS S3 업로드**: 촬영 완료 시 이미지를 합성하여 AWS S3 버킷에 자동 업로드
* **📱 QR 코드 공유**: 업로드된 이미지 URL을 **QR 코드**로 즉시 생성하여 모바일 다운로드 지원

<br/>

## 🛠️ 기술 스택 (Tech Stack)

| 분류 | 기술 |
| :-- | :-- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=flat&logo=bootstrap&logoColor=white) |
| **Cloud & DB** | ![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat&logo=amazons3&logoColor=white) (Image Storage) |
| **Libraries** | `aws-sdk` (S3 직접 업로드), `html2canvas` (DOM 캡처), `qrcode.react` (QR 생성) |

<br/>

## 🔍 주요 구현 로직 (Implementation Details)

**1. 이미지 합성 및 캡처 (`html2canvas`)**
* 4개의 `<canvas>` 태그(사진)와 `<img>` 태그(프레임)를 겹쳐놓은 `div` 영역을 `html2canvas`를 사용하여 하나의 이미지(Blob)로 변환합니다.
* 이때 `z-index`를 활용하여 프레임이 사진 위에 오도록 배치했습니다.

**2. AWS S3 Direct Upload**
* 백엔드 서버를 거치지 않고 프론트엔드에서 `aws-sdk`를 이용해 S3 버킷(`doit4cutbucket`)으로 직접 업로드하여 속도를 최적화했습니다.
* 파일명은 중복 방지를 위해 `studentID` 등을 활용하여 고유하게 생성됩니다.

**3. 좌우 반전 및 필터 처리**
* **거울 모드**: `transform: scaleX(-1)` 속성을 사용하여 웹캠 화면을 거울처럼 보이게 구현했습니다.
* **필터**: CSS `filter` 속성을 비디오 스트림과 캡처 캔버스 컨텍스트(`ctx.filter`) 양쪽에 모두 적용하여, 화면에 보이는 그대로 사진이 찍히도록 동기화했습니다.

<br/>

## 🚀 환경 변수 설정 (.env)

AWS SDK 구동을 위해 루트 디렉토리에 `.env` 파일 설정이 필요합니다.

```bash
REACT_APP_ACCESS_ID=your_aws_access_key_id
REACT_APP_ACCESS_KEY=your_aws_secret_access_key
REACT_APP_REGION=ap-northeast-2
```

<br/>

## 💡 현장 운영 경험 & 트러블 슈팅

**1. 현장 조명 대응 (밝기/대비 조절 기능 추가)**
* **문제**: 축제 부스 위치가 야외/실내로 변경되거나 시간에 따라 조명이 달라져 사진이 너무 어둡거나 밝게 나오는 문제 발생.
* **해결**: 고정된 필터 값을 사용하는 대신, `<input type="range">`를 이용해 **실시간으로 밝기와 대비를 조절**할 수 있는 UI를 추가하여 운영진이 상황에 맞춰 화질을 최적화함.

**2. 이미지 합성 위치 정렬 이슈**
* **문제**: 화면 해상도에 따라 캡처된 이미지에서 사진과 프레임의 위치가 어긋나는 현상.
* **해결**: 캡처 영역(`capture-div`)의 크기와 비율(`aspect-ratio`)을 고정하고, `flex` 레이아웃을 통해 사진과 프레임이 항상 정확한 위치에 겹치도록 CSS를 엄격하게 통제함.

<br/>

## 📬 Contact

* **Organization**: 아주대학교 IT 동아리 Do-iT
* **Developer**: [PaleBlueNote](https://github.com/PaleBlueNote)
* **Modifier**: [bang0930](https://github.com/bang0930)

* 

---
© 2024 Yoonseokchan. All rights reserved.
