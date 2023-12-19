import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="bg-slate-400 py-20 px-20 grid gap-10 lg:grid-cols-2 xl:grid-cols-3 xl:place-content-center ">
      <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col justify-between">
        <span className="font-semibold text-3xl">Select Item</span>
        <div className="dark">
          <div className="flex justify-between my-2 dark:bg-red-300 ">
            <span className="text-gray-500">Grey Chair</span>
            <span className="font-semibold">$19</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Grey Chair</span>
            <span className="font-semibold">$19</span>
          </div>
        </div>

        <div className="flex justify-between mt-2 pt-2 border-t-2 border-dashed">
          <span>Total</span>
          <span className="font-semibold">$10</span>
        </div>
        <div
          className="mt-5 bg-blue-500 text-white p-3
          text-center rounded-xl w-2/4 mx-auto
         "
        >
          Checkout
        </div>
      </div>

      <div className="bg-white overflow-hidden rounded-3xl shadow-xl">
        <div className="bg-blue-500 p-6 pb-14">
          <span className="text-white text-2xl">Profile</span>
        </div>
        <div className="rounded-3xl p-6 bg-white relative -top-5">
          <div className="flex relative -top-16 items-end justify-between">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Orders</span>
              <span className="font-medium">340</span>
            </div>
            <div className="h-24 w-24 bg-red-400 rounded-full" />
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500">Spent</span>
              <span className="font-medium">$340</span>
            </div>
          </div>
          <div className="relative  flex flex-col items-center -mt-10 -mb-5">
            <span className="text-lg font-medium">Tony Molloy</span>
            <span className="text-sm text-gray-500">미국</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-6 space-y-2 lg:col-span-2 xl:col-span-1">
        <div className="flex justify-between items-center">
          <span className="text-3xl">&larr;</span>
          <div className="space-x-2">
            <span className="font-semibold">별</span>
            <span className="rounded-md bg-fuchsia-300 p-1 shadow-xl">
              하트
            </span>
          </div>
        </div>

        <img src="https://thumbnail10.coupangcdn.com/thumbnails/remote/492x492ex/image/retail/images/99212757171500-b264f16c-f06d-4156-aee1-6f6dffc3d11e.jpg" />
        <div className="flex flex-col">
          <span className="font-semibold text-2xl">짱구</span>
          <span className="font-medium text-sm text-gray-400 mt-2">못말려</span>
        </div>
        <div>
          <div className="flex justify-between items-center ">
            <div className="flex justify-between w-20">
              <button className="w-4 h-4 rounded-full bg-blue-400 focus:ring-2 ring-offset-4 transition" />
              <button className="w-4 h-4 rounded-full bg-red-400 " />
              <button className="w-4 h-4 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center space-x-5">
              <span className="bg-slate-300 flex justify-center items-center aspect-square w-6 rounded-sm">
                -
              </span>
              <span>1</span>
              <span className="bg-slate-300 flex justify-center items-center aspect-square w-6 rounded-sm">
                +
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
