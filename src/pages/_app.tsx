import type { AppProps } from "next/app";
import "the-new-css-reset/css/reset.css";
import "src/styles/page/global.css";
// import "katex/dist/katex.min.css";
import ".pnpm/katex@0.16.7/node_modules/katex/dist/katex.min.css";
import { useEffect } from "react";
import * as process from "process";
import Layout from "@/components/Layout";
import startup from "@/Functions/Files/startup";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    startup();

    if (process.env.NODE_ENV === "production") {
      // 必要になったら各ページでメニューを実装する。
      document.body.addEventListener("contextmenu", e => {
        e.preventDefault();
      });

      // リロード、DevToolsの、標準の印刷の禁止
      window.addEventListener("keydown", e => {
        const { ctrlKey, key } = e;
        if (ctrlKey) {
          if (["r", "R", "i", "I", "p", "P"].includes(key)) e.preventDefault();
        } else if (["F5", "F12"].includes(key)) e.preventDefault();
      });
    }
  }, []);
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
