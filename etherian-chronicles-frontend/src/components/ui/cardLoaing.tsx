const CardLoading = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <div key={index} className="flex-none w-80 min-w-80">
      <div className="animate-pulse bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="h-48 bg-muted rounded-lg"></div>
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    </div>
  ));
};

export default CardLoading;
