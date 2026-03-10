export type StoryListItem = {
  id: string;
  title: string;
  filename: string;
};

type StoriesResponse = {
  stories: StoryListItem[];
};

export async function fetchStories(): Promise<StoryListItem[]> {
  const response = await fetch("/api/stories", { cache: "no-store" });
  const payload = (await response.json()) as StoriesResponse;
  if (!response.ok) {
    throw new Error("Failed to load stories");
  }
  return payload.stories ?? [];
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderMessage(target: HTMLElement, message: string): void {
  target.textContent = message;
}
