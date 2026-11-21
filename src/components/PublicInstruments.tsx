import { usePublicInstruments } from "../hooks/use-public-instruments";
import ListSection from "./ListSection";

/** Public table: readable by anyone, signed in or not. */
export default function PublicInstruments() {
  const { instruments, error, loading, retry } = usePublicInstruments();

  return (
    <ListSection
      title="Instruments"
      badge="PUBLIC"
      badgeTone="public"
      items={instruments.map((item) => ({ id: item.id, title: item.name }))}
      loading={loading}
      error={error}
      onRetry={retry}
      loadingText="Loading instruments..."
      emptyText="No instruments yet."
    />
  );
}
