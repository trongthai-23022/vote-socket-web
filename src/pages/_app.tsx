import "../styles/index.css"; // Đảm bảo rằng bạn có tệp globals.css trong thư mục styles

import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
