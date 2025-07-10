export default function Loading() {
  return (
    <div className="fixed top-0 z-1000 flex h-screen w-full items-center justify-center bg-black/70">
      <div
        className={`h-12 w-12 animate-spin rounded-full border-5 border-white border-t-transparent`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
}
