export default function Detail() {
  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center ">
      <div className="bg-white w-2/4 h-2/4 rounded-3xl p-6 space-y-2">
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
