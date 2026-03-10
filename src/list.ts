import { escapeHtml, fetchStories } from "./shared";

const storyListEl = document.querySelector<HTMLUListElement>("#story-list")!;
const storyCountEl = document.querySelector<HTMLParagraphElement>("#story-count")!;
const emptyStateEl = document.querySelector<HTMLParagraphElement>("#empty-state")!;
const errorStateEl = document.querySelector<HTMLParagraphElement>("#error-state")!;

void loadStories();

async function loadStories(): Promise<void> {
  try {
    const stories = await fetchStories();
    storyCountEl.textContent = `Found ${stories.length} compiled stories.`;

    if (stories.length === 0) {
      emptyStateEl.hidden = false;
      return;
    }

    storyListEl.innerHTML = stories
      .map(
        (story) => `
          <li class="story-card">
            <h2>${escapeHtml(story.title)}</h2>
            <p class="filename">${escapeHtml(story.filename)}</p>
            <a class="play-link" href="/play.html?id=${encodeURIComponent(story.id)}">Play</a>
          </li>
        `,
      )
      .join("\n");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errorStateEl.hidden = false;
    errorStateEl.textContent = `Failed to load stories: ${message}`;
    storyCountEl.textContent = "Unable to read story list.";
  }
}
