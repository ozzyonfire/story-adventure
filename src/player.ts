import { Story } from "inkjs";
import { fetchStories } from "./shared";

type PropertyTag = {
  property: string;
  val: string;
};

const storyTitleEl = document.querySelector<HTMLHeadingElement>("#story-title")!;
const bylineEl = document.querySelector<HTMLHeadingElement>("#story-byline")!;
const storyContainer = document.querySelector<HTMLElement>("#story")!;
const outerContainer = document.querySelector<HTMLElement>("#outer-container")!;
const headerEl = document.querySelector<HTMLElement>("#story-header")!;
const errorEl = document.querySelector<HTMLParagraphElement>("#player-error")!;

const url = new URL(window.location.href);
const storyId = url.searchParams.get("id");

if (!storyId) {
  showError("Missing story id. Open from the story list.");
} else {
  void loadStory(storyId);
}

async function loadStory(id: string): Promise<void> {
  try {
    const stories = await fetchStories();
    const storyMeta = stories.find((story) => story.id === id);
    if (!storyMeta) {
      throw new Error(`Story '${id}' not found`);
    }

    storyTitleEl.textContent = storyMeta.title;

    const storyResponse = await fetch(`/stories/${encodeURIComponent(storyMeta.filename)}`, {
      cache: "no-store",
    });

    if (!storyResponse.ok) {
      throw new Error(`Failed to load story file '${storyMeta.filename}'`);
    }

    const storyContent = (await storyResponse.json()) as Record<string, unknown>;
    startInkPlayer(storyContent, storyMeta.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    showError(message);
  }
}

function showError(message: string): void {
  errorEl.hidden = false;
  errorEl.textContent = message;
}

function startInkPlayer(storyContent: Record<string, unknown>, storyId: string): void {
  const story = new Story(storyContent);

  let savePoint = "";
  let globalTagTheme: string | undefined;
  const saveKey = `save-state:${storyId}`;
  const themeKey = "theme";

  const globalTags = story.globalTags;
  if (globalTags) {
    for (let i = 0; i < globalTags.length; i++) {
      const globalTag = globalTags[i] ?? "";
      const splitGlobalTag = splitPropertyTag(globalTag);
      if (!splitGlobalTag) continue;

      if (splitGlobalTag.property.toLowerCase() === "theme") {
        globalTagTheme = splitGlobalTag.val;
      } else if (splitGlobalTag.property.toLowerCase() === "author") {
        bylineEl.textContent = `by ${splitGlobalTag.val}`;
      }
    }
  }

  setupTheme(globalTagTheme, themeKey);
  const hasSave = loadSavePoint(story, saveKey);
  setupButtons({
    hasSave,
    saveKey,
    themeKey,
    story,
    storyContainer,
    getSavePoint: () => savePoint,
    onRestart: restart,
    onContinue: () => continueStory(true),
  });

  savePoint = story.state.toJson();
  continueStory(true);

  function continueStory(firstTime: boolean): void {
    let delay = 0.0;
    const previousBottomEdge = firstTime ? 0 : contentBottomEdgeY(storyContainer);

    while (story.canContinue) {
      const paragraphText = story.Continue();
      const tags = story.currentTags ?? [];
      const customClasses: string[] = [];

      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i] ?? "";
        const splitTag = splitPropertyTag(tag);
        const normalized = splitTag
          ? { property: splitTag.property.toUpperCase(), val: splitTag.val }
          : null;

        if (normalized?.property === "AUDIO") {
          replaceAudio("audio", normalized.val, false);
        } else if (normalized?.property === "AUDIOLOOP") {
          replaceAudio("audioLoop", normalized.val, true);
        } else if (normalized?.property === "IMAGE") {
          const imageElement = document.createElement("img");
          imageElement.src = normalized.val;
          storyContainer.appendChild(imageElement);
          imageElement.onload = () => scrollDown(outerContainer, previousBottomEdge);
          showAfter(delay, imageElement);
          delay += 200.0;
        } else if (normalized?.property === "LINK") {
          window.location.href = normalized.val;
        } else if (normalized?.property === "LINKOPEN") {
          window.open(normalized.val, "_blank", "noopener,noreferrer");
        } else if (normalized?.property === "BACKGROUND") {
          outerContainer.style.backgroundImage = `url(${normalized.val})`;
        } else if (normalized?.property === "CLASS") {
          customClasses.push(normalized.val);
        } else if (tag === "CLEAR" || tag === "RESTART") {
          removeAll(storyContainer, "p");
          removeAll(storyContainer, "img");
          setVisible(headerEl, false);
          if (tag === "RESTART") {
            restart();
            return;
          }
        }
      }

      if (!paragraphText || paragraphText.trim().length === 0) {
        continue;
      }

      const paragraphElement = document.createElement("p");
      paragraphElement.innerHTML = paragraphText;
      storyContainer.appendChild(paragraphElement);

      for (let i = 0; i < customClasses.length; i++) {
        paragraphElement.classList.add(customClasses[i] ?? "");
      }

      showAfter(delay, paragraphElement);
      delay += 200.0;
    }

    story.currentChoices.forEach((choice) => {
      const choiceTags = choice.tags ?? [];
      const choiceClasses: string[] = [];
      let isClickable = true;

      for (let i = 0; i < choiceTags.length; i++) {
        const choiceTag = choiceTags[i] ?? "";
        const splitChoiceTag = splitPropertyTag(choiceTag);
        const normalized = splitChoiceTag
          ? { property: splitChoiceTag.property.toUpperCase(), val: splitChoiceTag.val }
          : null;

        if (choiceTag.toUpperCase() === "UNCLICKABLE") {
          isClickable = false;
        }

        if (normalized?.property === "CLASS") {
          choiceClasses.push(normalized.val);
        }
      }

      const choiceParagraphElement = document.createElement("p");
      choiceParagraphElement.classList.add("choice");
      for (let i = 0; i < choiceClasses.length; i++) {
        choiceParagraphElement.classList.add(choiceClasses[i] ?? "");
      }

      if (isClickable) {
        choiceParagraphElement.innerHTML = `<a href="#">${choice.text}</a>`;
      } else {
        choiceParagraphElement.innerHTML = `<span class="unclickable">${choice.text}</span>`;
      }

      storyContainer.appendChild(choiceParagraphElement);
      showAfter(delay, choiceParagraphElement);
      delay += 200.0;

      if (isClickable) {
        const choiceAnchorEl = choiceParagraphElement.querySelector<HTMLAnchorElement>("a");
        const choiceIndex = choice.index;
        choiceAnchorEl?.addEventListener("click", (event) => {
          event.preventDefault();
          storyContainer.style.height = `${contentBottomEdgeY(storyContainer)}px`;
          removeAll(storyContainer, ".choice");
          story.ChooseChoiceIndex(choiceIndex);
          savePoint = story.state.toJson();
          continueStory(false);
        });
      }
    });

    storyContainer.style.height = "";
    if (!firstTime) {
      scrollDown(outerContainer, previousBottomEdge);
    }
  }

  function restart(): void {
    story.ResetState();
    setVisible(headerEl, true);
    savePoint = story.state.toJson();
    continueStory(true);
    outerContainer.scrollTo(0, 0);
  }
}

function splitPropertyTag(tag: string): PropertyTag | null {
  const propertySplitIdx = tag.indexOf(":");
  if (propertySplitIdx < 0) {
    return null;
  }
  const property = tag.substring(0, propertySplitIdx).trim();
  const val = tag.substring(propertySplitIdx + 1).trim();
  return { property, val };
}

function replaceAudio(key: "audio" | "audioLoop", src: string, loop: boolean): void {
  const holder = window as unknown as Record<string, HTMLAudioElement | undefined>;
  const existing = holder[key];
  if (existing) {
    existing.pause();
    existing.removeAttribute("src");
    existing.load();
  }

  const audio = new Audio(src);
  audio.loop = loop;
  void audio.play();
  holder[key] = audio;
}

function isAnimationEnabled(): boolean {
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

function showAfter(delay: number, el: HTMLElement): void {
  if (isAnimationEnabled()) {
    el.classList.add("hide");
    window.setTimeout(() => el.classList.remove("hide"), delay);
  } else {
    el.classList.remove("hide");
  }
}

function scrollDown(outerScrollContainer: HTMLElement, previousBottomEdge: number): void {
  if (!isAnimationEnabled()) {
    return;
  }

  let target = previousBottomEdge;
  const limit = outerScrollContainer.scrollHeight - outerScrollContainer.clientHeight;
  if (target > limit) target = limit;

  const start = outerScrollContainer.scrollTop;
  const dist = target - start;
  const duration = 300 + (300 * dist) / 100;

  let startTime: number | null = null;
  const step = (time: number) => {
    if (startTime === null) startTime = time;
    const t = (time - startTime) / duration;
    const lerp = 3 * t * t - 2 * t * t * t;
    outerScrollContainer.scrollTo(0, (1.0 - lerp) * start + lerp * target);
    if (t < 1) window.requestAnimationFrame(step);
  };

  window.requestAnimationFrame(step);
}

function contentBottomEdgeY(container: HTMLElement): number {
  const bottomElement = container.lastElementChild as HTMLElement | null;
  return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
}

function removeAll(container: HTMLElement, selector: string): void {
  const allElements = container.querySelectorAll<HTMLElement>(selector);
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements.item(i);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
}

function setVisible(element: HTMLElement, visible: boolean): void {
  if (!visible) {
    element.classList.add("invisible");
  } else {
    element.classList.remove("invisible");
  }
}

function loadSavePoint(story: Story, saveKey: string): boolean {
  try {
    const savedState = window.localStorage.getItem(saveKey);
    if (savedState) {
      story.state.LoadJson(savedState);
      return true;
    }
  } catch {
    // ignore storage errors
  }
  return false;
}

function setupTheme(globalTagTheme: string | undefined, themeKey: string): void {
  let savedTheme: string | null = null;
  try {
    savedTheme = window.localStorage.getItem(themeKey);
  } catch {
    // ignore storage errors
  }

  const browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (
    savedTheme === "dark" ||
    (savedTheme == null && globalTagTheme === "dark") ||
    (savedTheme == null && globalTagTheme == null && browserDark)
  ) {
    document.body.classList.add("dark");
  }
}

type ButtonSetup = {
  hasSave: boolean;
  saveKey: string;
  themeKey: string;
  story: Story;
  storyContainer: HTMLElement;
  getSavePoint: () => string;
  onRestart: () => void;
  onContinue: () => void;
};

function setupButtons(config: ButtonSetup): void {
  const { hasSave, saveKey, themeKey, story, storyContainer, getSavePoint, onRestart, onContinue } =
    config;

  const rewindEl = document.querySelector<HTMLAnchorElement>("#rewind");
  rewindEl?.addEventListener("click", () => {
    removeAll(storyContainer, "p");
    removeAll(storyContainer, "img");
    onRestart();
  });

  const saveEl = document.querySelector<HTMLAnchorElement>("#save");
  saveEl?.addEventListener("click", () => {
    try {
      window.localStorage.setItem(saveKey, getSavePoint());
      const reloadBtn = document.querySelector<HTMLAnchorElement>("#reload");
      reloadBtn?.removeAttribute("disabled");
      window.localStorage.setItem(themeKey, document.body.classList.contains("dark") ? "dark" : "");
    } catch {
      // ignore storage errors
    }
  });

  const reloadEl = document.querySelector<HTMLAnchorElement>("#reload");
  if (reloadEl && !hasSave) {
    reloadEl.setAttribute("disabled", "disabled");
  }
  reloadEl?.addEventListener("click", () => {
    if (reloadEl.getAttribute("disabled")) return;

    removeAll(storyContainer, "p");
    removeAll(storyContainer, "img");
    try {
      const savedState = window.localStorage.getItem(saveKey);
      if (savedState) story.state.LoadJson(savedState);
    } catch {
      // ignore storage errors
    }
    onContinue();
  });

  const themeSwitchEl = document.querySelector<HTMLAnchorElement>("#theme-switch");
  themeSwitchEl?.addEventListener("click", () => {
    document.body.classList.add("switched");
    document.body.classList.toggle("dark");
  });
}
