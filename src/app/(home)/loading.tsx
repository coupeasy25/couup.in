import Container from "@/components/Container";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-[100px] pb-12 flex flex-col w-full">
        <Container>
          <div className="flex flex-col w-full gap-5">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="h-4 w-24 bg-neutral-200 rounded-md animate-pulse"></div>
              <div className="h-8 w-64 bg-neutral-200 rounded-md animate-pulse mt-1"></div>
            </div>

            {/* Filter Bar Skeleton */}
            <div className="sticky top-[80px] z-30 bg-white py-3 border-b border-neutral-100 mb-2 flex gap-3 overflow-hidden">
              <div className="h-10 w-24 bg-neutral-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-20 bg-neutral-200 rounded-full animate-pulse"></div>
              <div className="h-10 w-24 bg-neutral-200 rounded-full animate-pulse"></div>
              <div className="h-10 w-28 bg-neutral-200 rounded-full animate-pulse"></div>
              <div className="h-10 w-32 bg-neutral-200 rounded-full animate-pulse"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="col-span-1 flex flex-col gap-2 w-full">
                  {/* Image Skeleton */}
                  <div className="aspect-[4/3] w-full bg-neutral-200 rounded-xl animate-pulse"></div>
                  {/* Text Skeletons */}
                  <div className="flex flex-col mt-1 gap-1">
                    <div className="h-5 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-neutral-200 rounded animate-pulse mt-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
