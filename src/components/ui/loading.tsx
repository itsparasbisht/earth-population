interface LoadingProps {
  message?: string;
}

export const Loading = ({
  message = "Loading Latest Statistics...",
}: LoadingProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
      <div className="w-16 h-16 mb-8 relative">
        <div className="absolute inset-0 border-t-2 border-l-2 border-accent animate-spin rounded-full"></div>
        <div className="absolute inset-2 border-r-2 border-b-2 border-primary animate-spin rounded-full"></div>
      </div>
      <p className="text-lg italic font-serif">{message}</p>
      <p className="text-sm mt-2 font-serif">
        Please wait while we gather the data...
      </p>
    </div>
  );
};
