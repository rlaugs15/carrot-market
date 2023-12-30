import "../styles/globals.css";
import type { AppProps } from "next/app";
import useSWR, { SWRConfig } from "swr";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      <SWRConfig
        value={{
          fetcher: (url: string) =>
            fetch(url).then((response) => response.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}

export default MyApp;
