
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Avatar {
    id: number;
    svg: React.ReactNode;
    alt: string;
    dataUrl: string;
}

const avatars: Avatar[] = [
    {
        id: 1,
        dataUrl: "data:image/svg+xml;base64," + btoa(`<svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><mask id="avatar1" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF" /></mask><g mask="url(#avatar1)"><rect width="36" height="36" fill="#ff005b" /><rect x="0" y="0" width="36" height="36" transform="translate(9 -5) rotate(219 18 18) scale(1)" fill="#ffb238" rx="6" /><g transform="translate(4.5 -4) rotate(9 18 18)"><path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" stroke-linecap="round" /><rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" /><rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" /></g></g></svg>`),
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 1"
            >
                <title>Avatar 1</title>
                <mask
                    id="avatar1picker"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#avatar1picker)">
                    <rect width="36" height="36" fill="#ff005b" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(9 -5) rotate(219 18 18) scale(1)"
                        fill="#ffb238"
                        rx="6"
                    />
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path
                            d="M15 19c2 1 4 1 6 0"
                            stroke="#000000"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <rect
                            x="10"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                        <rect
                            x="24"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 1",
    },
    {
        id: 2,
        dataUrl: "data:image/svg+xml;base64," + btoa(`<svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><mask id="avatar2" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF" /></mask><g mask="url(#avatar2)"><rect width="36" height="36" fill="#ff7d10" /><rect x="0" y="0" width="36" height="36" transform="translate(5 -1) rotate(55 18 18) scale(1.1)" fill="#0a0310" rx="6" /><g transform="translate(7 -6) rotate(-5 18 18)"><path d="M15 20c2 1 4 1 6 0" stroke="#FFFFFF" fill="none" stroke-linecap="round" /><rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" /><rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" /></g></g></svg>`),
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 2"
            >
                <title>Avatar 2</title>
                <mask
                    id="avatar2picker"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#avatar2picker)">
                    <rect width="36" height="36" fill="#ff7d10" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(5 -1) rotate(55 18 18) scale(1.1)"
                        fill="#0a0310"
                        rx="6"
                    />
                    <g transform="translate(7 -6) rotate(-5 18 18)">
                        <path
                            d="M15 20c2 1 4 1 6 0"
                            stroke="#FFFFFF"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <rect
                            x="14"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                        <rect
                            x="20"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 2",
    },
    {
        id: 3,
        dataUrl: "data:image/svg+xml;base64," + btoa(`<svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><mask id="avatar3" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF" /></mask><g mask="url(#avatar3)"><rect width="36" height="36" fill="#0a0310" /><rect x="0" y="0" width="36" height="36" transform="translate(-3 7) rotate(227 18 18) scale(1.2)" fill="#ff005b" rx="36" /><g transform="translate(-3 3.5) rotate(7 18 18)"><path d="M13,21 a1,0.75 0 0,0 10,0" fill="#FFFFFF" /><rect x="12" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" /><rect x="22" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF" /></g></g></svg>`),
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 3"
            >
                <title>Avatar 3</title>
                <mask
                    id="avatar3picker"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#avatar3picker)">
                    <rect width="36" height="36" fill="#0a0310" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(-3 7) rotate(227 18 18) scale(1.2)"
                        fill="#ff005b"
                        rx="36"
                    />
                    <g transform="translate(-3 3.5) rotate(7 18 18)">
                        <path d="M13,21 a1,0.75 0 0,0 10,0" fill="#FFFFFF" />
                        <rect
                            x="12"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                        <rect
                            x="22"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#FFFFFF"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 3",
    },
    {
        id: 4,
        dataUrl: "data:image/svg+xml;base64," + btoa(`<svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="40" height="40"><mask id="avatar4" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF" /></mask><g mask="url(#avatar4)"><rect width="36" height="36" fill="#d8fcb3" /><rect x="0" y="0" width="36" height="36" transform="translate(9 -5) rotate(219 18 18) scale(1)" fill="#89fcb3" rx="6" /><g transform="translate(4.5 -4) rotate(9 18 18)"><path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" stroke-linecap="round" /><rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" /><rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000" /></g></g></svg>`),
        svg: (
            <svg
                viewBox="0 0 36 36"
                fill="none"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                aria-label="Avatar 4"
            >
                <title>Avatar 4</title>
                <mask
                    id="avatar4picker"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                >
                    <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                </mask>
                <g mask="url(#avatar4picker)">
                    <rect width="36" height="36" fill="#d8fcb3" />
                    <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(9 -5) rotate(219 18 18) scale(1)"
                        fill="#89fcb3"
                        rx="6"
                    />
                    <g transform="translate(4.5 -4) rotate(9 18 18)">
                        <path
                            d="M15 19c2 1 4 1 6 0"
                            stroke="#000000"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <rect
                            x="10"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                        <rect
                            x="24"
                            y="14"
                            width="1.5"
                            height="2"
                            rx="1"
                            stroke="none"
                            fill="#000000"
                        />
                    </g>
                </g>
            </svg>
        ),
        alt: "Avatar 4",
    },
];

interface AvatarPickerProps {
    selectedAvatar?: Avatar;
    onAvatarSelect: (avatar: Avatar) => void;
    className?: string;
}

export default function AvatarPicker({ selectedAvatar, onAvatarSelect, className }: AvatarPickerProps) {
    const handleAvatarSelect = (avatar: Avatar) => {
        onAvatarSelect(avatar);
    };

    return (
        <div className={cn("w-full", className)}>
            <div className="grid grid-cols-4 gap-3">
                {avatars.map((avatar) => (
                    <motion.button
                        key={avatar.id}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar)}
                        className={cn(
                            "relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300",
                            selectedAvatar?.id === avatar.id 
                                ? "border-primary ring-2 ring-primary ring-offset-2" 
                                : "border-muted hover:border-primary/50"
                        )}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 },
                        }}
                        whileTap={{
                            scale: 0.95,
                            transition: { duration: 0.2 },
                        }}
                        aria-label={`Select ${avatar.alt}`}
                    >
                        <div className="w-full h-full flex items-center justify-center scale-150">
                            {avatar.svg}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

export { avatars };
export type { Avatar };
