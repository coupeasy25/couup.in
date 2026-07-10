"use client";

interface ContainerProps {
  children: React.ReactNode;
  ClassName?: string;
}

const Container: React.FC<ContainerProps> = ({ children, ClassName }) => {
  return (
    <div className={`max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 ${ClassName || ""}`}>
      {children}
    </div>
  );
};

export default Container;
