import { Provider } from "react-redux";
import { store } from "@/rudex/store";
import { Header } from "@/components/Header";
import dynamic from "next/dynamic";

// const inter = Inter({ subsets: ["latin"] });

const ReportEditor = dynamic(() => import("src/components/Editor/ReportEditor"), { ssr: false });
export default function Home() {
  return (
    <div>
      <Header />
      <Provider store={store}>
        <span>-----------------------------</span>
        <ReportEditor />
        <span>-----------------------------</span>
      </Provider>
    </div>
  );
}
