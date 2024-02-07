import Button from "@/components/button";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const ErrorPage: NextPage = () => {
  const router = useRouter();
  const onValid = () => {
    router.replace("/");
  };
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="">
        <div className="text-center flex justify-center items-center flex-col space-y-3">
          <div>
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 1280.000000 640.000000"
              preserveAspectRatio="xMidYMid meet"
            >
              <metadata>
                Created by potrace 1.15, written by Peter Selinger 2001-2017
              </metadata>
              <g
                transform="translate(0.000000,640.000000) scale(0.100000,-0.100000)"
                fill="#ff9800"
                stroke="none"
              >
                <path
                  d="M9631 5985 c-365 -83 -714 -374 -1097 -915 -247 -348 -548 -893 -764
      -1382 -40 -93 -75 -166 -77 -165 -2 2 -12 55 -23 118 -24 130 -40 189 -51 189
      -4 0 -26 35 -49 78 -335 642 -1230 783 -2550 402 -156 -45 -338 -104 -346
      -113 -3 -3 17 -32 44 -66 125 -156 249 -477 297 -771 20 -123 32 -370 18 -370
      -19 0 -123 252 -263 635 -102 279 -179 470 -206 512 l-14 22 -77 -29 c-1321
      -486 -2793 -1363 -3610 -2153 -354 -343 -743 -892 -832 -1176 -62 -197 -22
      -327 115 -375 165 -57 439 -18 882 127 266 88 485 136 1522 337 173 33 387 75
      475 92 88 17 163 34 168 37 8 8 -64 528 -94 671 -32 156 -74 264 -118 304 -31
      28 -26 36 17 23 57 -17 159 -126 209 -222 81 -158 131 -374 140 -602 3 -79 10
      -143 15 -143 13 0 778 161 998 210 1114 248 1996 508 2550 752 519 229 811
      468 860 705 13 59 2 183 -45 536 l-5 39 123 -114 c536 -493 1101 -904 1556
      -1132 544 -273 964 -331 1286 -177 179 85 316 234 420 454 61 130 79 202 79
      322 -1 113 -20 177 -80 267 -19 28 -37 55 -40 60 -4 6 151 8 383 6 378 -3 390
      -2 445 19 237 89 606 452 755 741 61 117 95 207 125 327 18 75 22 117 22 250
      -1 140 -4 172 -27 260 -49 185 -142 348 -278 490 -176 183 -425 315 -681 359
      -243 43 -413 40 -565 -10 -85 -28 -323 -134 -505 -225 l-120 -60 6 63 c9 86
      -15 203 -59 290 -109 216 -358 423 -587 488 -96 28 -260 35 -347 15z"
                />
              </g>
            </svg>
          </div>
          <span className="font-semibold text-2xl">
            해당 페이지를 찾을 수 없습니다.
          </span>
          <p className="text-base text-gray-400">
            찾으려는 페이지의 주소가 잘못 입력되었거나,
            <br />
            주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.
            <br />
            입력하신 페이지의 주소가 정확한지 다시 한 번 확인해주세요.
          </p>
          <span onClick={onValid}>
            <Button text="홈 화면으로 가기" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
