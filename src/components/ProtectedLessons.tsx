import { useProtectedLessons } from "../hooks/use-protected-lessons";
import ListSection from "./ListSection";

/** RLS-protected table: only signed-in users can read it. */
export default function ProtectedLessons() {
  const { lessons, error, loading, retry } = useProtectedLessons();

  return (
    <ListSection
      title="Lessons"
      badge="MEMBERS ONLY"
      badgeTone="private"
      items={lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        subtitle: `${lesson.instrument} · ${lesson.level}`,
      }))}
      loading={loading}
      error={error}
      onRetry={retry}
      loadingText="Loading lessons..."
      emptyText="No lessons available yet."
    />
  );
}
