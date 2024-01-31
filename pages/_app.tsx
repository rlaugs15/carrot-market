import useUser from "@/libs/client/useUser";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import useSWR, { SWRConfig } from "swr";

//로그인되어 있지 않으면 /enter로
function CustomUser() {
  const { user } = useUser();
  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <SWRConfig
        value={{
          fetcher: (url: string) =>
            fetch(url).then((response) => response.json()),
        }}
      >
        <CustomUser />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}

export default MyApp;
