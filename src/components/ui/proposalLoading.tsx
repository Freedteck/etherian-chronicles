import Header from "../Layout/Header";

const ProposalLoading = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation Skeleton */}
        <div className="mb-6">
          <div className="h-10 w-32 bg-muted rounded-md animate-pulse"></div>
        </div>

        {/* Proposal Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cover Image Skeleton */}
            <div className="lg:w-1/3">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted animate-pulse">
                <div className="absolute top-4 left-4 h-6 w-20 bg-muted-foreground/30 rounded-full"></div>
                <div className="absolute top-4 right-4 h-6 w-24 bg-muted-foreground/30 rounded-full"></div>
              </div>
            </div>

            {/* Proposal Info Skeleton */}
            <div className="lg:w-2/3 space-y-4">
              <div className="h-10 w-3/4 bg-muted rounded-md animate-pulse"></div>

              <div className="flex space-x-4">
                <div className="h-5 w-32 bg-muted rounded-md animate-pulse"></div>
                <div className="h-5 w-40 bg-muted rounded-md animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-5/6 bg-muted rounded-md animate-pulse"></div>
                <div className="h-4 w-4/6 bg-muted rounded-md animate-pulse"></div>
              </div>

              {/* Genre Tags Skeleton */}
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-muted rounded-full animate-pulse"></div>
                <div className="h-6 w-20 bg-muted rounded-full animate-pulse"></div>
                <div className="h-6 w-14 bg-muted rounded-full animate-pulse"></div>
              </div>

              {/* Voting Stats Skeleton */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="h-5 w-32 bg-muted rounded-md animate-pulse"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-48 bg-muted rounded-md animate-pulse"></div>
                    <div className="h-4 w-16 bg-muted rounded-md animate-pulse"></div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 animate-pulse"></div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-3">
                <div className="h-10 w-32 bg-muted rounded-md animate-pulse"></div>
                <div className="h-10 w-40 bg-muted rounded-md animate-pulse"></div>
              </div>

              <div className="h-10 w-24 bg-muted rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Chapter Preview Skeleton */}
        <div className="bg-card rounded-xl border border-border p-8 space-y-4">
          <div className="h-7 w-64 bg-muted rounded-md animate-pulse"></div>
          <div className="h-6 w-3/4 bg-muted rounded-md animate-pulse"></div>

          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded-md animate-pulse"></div>
            <div className="h-4 w-5/6 bg-muted rounded-md animate-pulse"></div>
            <div className="h-4 w-4/6 bg-muted rounded-md animate-pulse"></div>
            <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse"></div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="h-5 w-48 bg-muted rounded-md animate-pulse"></div>
            <div className="h-12 w-full bg-muted rounded-lg animate-pulse"></div>
            <div className="h-12 w-full bg-muted rounded-lg animate-pulse"></div>
            <div className="h-12 w-full bg-muted rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalLoading;
