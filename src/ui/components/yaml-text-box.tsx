"use client";

import { Copy } from "lucide-react";
import { Button } from "./button";
import { useToast } from "./toast";
import { H4, P } from "./typography";

interface YamlTextBoxProps {
  stringCode: string;
  title: string;
  description: string;
}

export const YamlTextBox = ({
  stringCode,
  title,
  description,
}: YamlTextBoxProps) => {
  const { toast } = useToast();

  const highlightYaml = (code: string) => {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^(\s*-\s)/gm, "<span>$1</span>")
      .replace(/^(\s*[\w-]+):/gm, "<span>$1</span>:")
      .replace(/:\s*(.+)$/gm, ": <span>$1</span>")
      .replace(/^---/gm, "<span >---</span>")
      .replace(/^\s*#.+/gm, "<span>$&</span>");
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Copy failed",
        description: "Failed to copy code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div>
        <H4>{title}</H4>
        <P>{description}</P>
      </div>
      <pre
        id="yaml-output"
        className="p-4 rounded-md bg-gray-100 overflow-x-auto max-h-48 overflow-auto"
        aria-live="polite"
      >
        <code
          dangerouslySetInnerHTML={{ __html: highlightYaml(stringCode) }}
          className="font-mono text-sm text-dark"
        />
      </pre>
      <div className="flex justify-end">
        <Button
          onClick={() => copyToClipboard(stringCode)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy code
        </Button>
      </div>
    </div>
  );
};
