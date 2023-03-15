import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";
import { store } from "@/rudex/store";
import { Header } from "@/components/Header";
// import ReportEditor from "@/components/Editor/ReportEditor";

const inter = Inter({ subsets: ["latin"] });

const ReportEditor = dynamic(() => import("src/components/Editor/ReportEditor"), { ssr: false });
console.log(ReportEditor);
export default function Home() {
  return (
    <div>
      <Header />
      <Provider store={store}>
        <div>↓えでぃたー</div>
        <ReportEditor />
      </Provider>
    </div>
  );
}
