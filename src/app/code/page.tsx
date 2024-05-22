import CodeEditor from "@/components/CodeEditor";
import Sidebar from "@/components/Sidebar";
import Tabs from "@/components/Tabs";
// import TerminalComponent from "@/components/Terminal";
import dynamic from "next/dynamic";
const TerminalComponent = dynamic(() => import("@/components/Terminal"), {
  ssr: false,
});
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import PreviewButton from "@/components/Preview";

const CodePage = () => {
  return (
    <main className="w-screen h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={10}>
          <Sidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65}>
              <Tabs />
              <CodeEditor />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel maxSize={60} defaultSize={35}>
              <TerminalComponent />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={10}>
          <PreviewButton />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default CodePage;
