import type { AppProps } from "next/app";
import "src/styles/page/style.css";
import "the-new-css-reset/css/reset.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
