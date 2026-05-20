"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-[#F4F1EA] border-2 border-[#0A0A0A] flex items-center justify-center text-6xl opacity-20">
        📦
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square bg-[#F4F1EA] border-2 border-[#0A0A0A] relative overflow-hidden">
        <Image
          src={images[selected] as string}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-16 h-16 border-2 relative overflow-hidden transition-all ${
                i === selected
                  ? "border-[#0A0A0A] opacity-100"
                  : "border-[#0A0A0A]/30 opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={url!} alt={`${title} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
