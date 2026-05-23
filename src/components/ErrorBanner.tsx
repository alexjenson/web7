export function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="card border-red-500/20 bg-red-500/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-3xl shrink-0">⚠️</div>
        <div className="flex-1">
          <p className="text-white font-medium">Analysis Failed</p>
          <p className="text-gray-400 text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={onRetry}
          className="shrink-0 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
