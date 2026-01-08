"use client";

import { useEffect, useState } from "react";
import { History, Code2, X } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatLayoutProps {
  children: React.ReactNode;
  chatHistory?: React.ReactNode;
  artifacts?: React.ReactNode;
  artifactContent?: React.ReactNode;
  onOpenArtifacts?: () => void;
}

// Right Panel Component (for artifacts) - Simple collapsible panel
function ArtifactsPanelWrapper({
  artifacts,
  artifactContent,
}: {
  artifacts?: React.ReactNode;
  artifactContent?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Expose method to open artifacts panel
    (window as any).__openArtifacts = () => {
      setIsOpen(true);
    };
    return () => {
      delete (window as any).__openArtifacts;
    };
  }, []);

  if (!isOpen && !artifactContent && !artifacts) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-20 w-80 bg-white border-l border-gray-200 transition-transform duration-200 ease-linear shadow-lg",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-gray-600" />
            <h2 className="font-semibold text-sm text-gray-900">
              &lt;/&gt; Artifacts
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {artifactContent || artifacts || (
              <div className="text-sm text-gray-500 text-center py-8">
                No artifacts yet
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// Main Chat Layout Component
export function ChatLayout({
  children,
  chatHistory,
  artifacts,
  artifactContent,
  onOpenArtifacts,
}: ChatLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Left Sidebar - Chat History */}
        <Sidebar collapsible="offcanvas" variant="sidebar">
          <SidebarHeader className="border-b border-gray-200">
            <div className="flex items-center gap-2 px-4 py-3">
              <History className="w-4 h-4 text-gray-600" />
              <h2 className="font-semibold text-sm text-gray-900">
                Chat History
              </h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-full">
              <div className="p-2">
                {chatHistory || (
                  <div className="text-sm text-gray-500 text-center py-8">
                    No chat history yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex-1 overflow-hidden relative">
          <div className="h-full w-full overflow-hidden">{children}</div>
          
          {/* Right Panel - Artifacts */}
          <ArtifactsPanelWrapper
            artifacts={artifacts}
            artifactContent={artifactContent}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
