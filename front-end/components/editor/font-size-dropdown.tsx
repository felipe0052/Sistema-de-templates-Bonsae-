"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Editor } from "@tiptap/react";

const FONT_SIZES = [
    { label: "10pt", value: "10pt" },
    { label: "12pt", value: "12pt" },
    { label: "14pt", value: "14pt" },
    { label: "16pt", value: "16pt" },
    { label: "18pt", value: "18pt" },
    { label: "20pt", value: "20pt" },
    { label: "24pt", value: "24pt" },
];

interface FontSizeDropdownProps {
    editor: Editor | null;
}

export function FontSizeDropdown({ editor }: FontSizeDropdownProps) {
    const [currentSize, setCurrentSize] = useState("12pt");

    const handleSelect = (size: string) => {
        if (!editor) return;
        setCurrentSize(size);
        editor.chain().focus().setFontSize(size).run();
    };

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 gap-1 text-xs font-medium min-w-15"
                        >
                            {currentSize}
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Tamanho da fonte</p>
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="start">
                {FONT_SIZES.map((size) => (
                    <DropdownMenuItem
                        key={size.value}
                        onClick={() => handleSelect(size.value)}
                    >
                        {size.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
