"use client";
import ResizableSidebar from "@/components/ResizableSidebar";
import SchemaCanvas from "@/components/SchemaCanvas";

export default function EditorPage() {
  return (
    <main className="flex h-screen w-full flex-row overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-950">
      <ResizableSidebar />
      <div className="flex-1 h-full relative">
        <SchemaCanvas />
      </div>
    </main>
  );
}
