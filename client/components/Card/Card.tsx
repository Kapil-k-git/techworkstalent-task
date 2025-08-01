import React from "react";
import Image, { StaticImageData } from "next/image";

interface MovieCardProps {
  title: string;
  year: string;
  poster: StaticImageData | string;
}

const Card: React.FC<MovieCardProps> = ({ title, year, poster }) => {
  return (
    <div className="w-full bg-[#092C39] rounded-xl overflow-hidden cursor-pointer p-2 transform transition-transform duration-300 hover:scale-105">
      <div className="size-full min-h-[400px] max-h-[400px]">
        <Image
          src={poster} // Just use poster directly - it's already a full Cloudinary URL
          alt={title}
          className="w-full h-full object-cover object-center rounded-xl"
          width={450}
          height={500}
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-white text-base md:text-xl font-medium">{title}</h2>
        <p className="text-white text-sm">{year}</p>
      </div>
    </div>
  );
};

export default Card;