export default function LoadingSpinner({ message = "Fetching recommendations…" }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner" aria-label="Loading" />
      <p className="loading-message">{message}</p>
    </div>
  );
}
