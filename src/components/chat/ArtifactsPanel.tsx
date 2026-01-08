"use client";

import { useState } from "react";
import { Code2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface ArtifactsPanelProps {
  codeBlocks: Array<{ language: string; code: string }>;
  defaultLanguage?: string;
}

export function ArtifactsPanel({ codeBlocks, defaultLanguage }: ArtifactsPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedCode = codeBlocks[selectedIndex] || codeBlocks[0];

  if (!selectedCode) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No code to display
      </div>
    );
  }

  // Try to render preview (for HTML, JSX, etc.)
  const canPreview = ["html", "jsx", "tsx", "javascript", "typescript"].includes(
    selectedCode.language.toLowerCase()
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {codeBlocks.length > 1 && (
        <div className="px-4 py-2 border-b border-gray-200 bg-white">
          <select
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {codeBlocks.map((block, index) => (
              <option key={index} value={index}>
                {block.language || "text"} {index > 0 && `(${index + 1})`}
              </option>
            ))}
          </select>
        </div>
      )}

      <Tabs defaultValue="code" className="flex-1 flex flex-col min-h-0 bg-white">
        <div className="px-4 py-2 border-b border-gray-200 bg-white">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Code
            </TabsTrigger>
            {canPreview && (
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="code" className="flex-1 m-0 min-h-0 bg-white">
          <ScrollArea className="h-full bg-white">
            <div className="p-4 bg-white">
              <SyntaxHighlighter
                language={selectedCode.language || "text"}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  backgroundColor: "#1e1e1e",
                }}
                showLineNumbers
                wrapLines
              >
                {selectedCode.code}
              </SyntaxHighlighter>
            </div>
          </ScrollArea>
        </TabsContent>

        {canPreview && (
          <TabsContent value="preview" className="flex-1 m-0 min-h-0 bg-white">
            <ScrollArea className="h-full bg-white">
              <div className="p-4 bg-white">
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <iframe
                    srcDoc={selectedCode.code}
                    className="w-full h-[600px] border-0"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

