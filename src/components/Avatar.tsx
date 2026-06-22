"use client";

import { Avatar as ShadcnAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarProps {
  src?: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <ShadcnAvatar className="h-[30px] w-[30px]">
      <AvatarImage src={src || ""} />
      <AvatarFallback className="bg-neutral-200">
        <svg fill="currentColor" viewBox="0 0 24 24" className="text-neutral-500 h-full w-full p-1">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </AvatarFallback>
    </ShadcnAvatar>
  );
};

export default Avatar;
