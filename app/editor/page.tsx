"use client";
import ResizableSidebar from "@/components/ResizableSidebar";
import SchemaCanvas from "@/components/SchemaCanvas";
import TableInspector from "@/components/TableInspector";
import EditorNavbar from "@/components/EditorNavbar";

export default function EditorPage() {
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-zinc-950 text-white selection:bg-blue-500/30">
      <EditorNavbar />
      <div className="flex-1 flex flex-row overflow-hidden relative">
        <ResizableSidebar />
        <div className="flex-1 h-full relative">
          <SchemaCanvas />
          <TableInspector />
        </div>
      </div>
    </main>
  );
}
