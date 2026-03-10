---
name: story-adventure
description: Build interactive choose-your-own-adventure stories with an Ink-first pipeline. Use when a user wants to create or refine story planning artifacts, generate an Ink script, run critique/finalization passes, and validate compilability with the Ink Node toolchain.
---

# Story Adventure

Use this skill to produce a complete Ink story package with prewriting, scene-imaging, critique, and build phases.

## Workflow Contract

Every story run uses this fixed artifact set:

- `premise.md`
- `outline.md`
- `canon.md`
- `scenes.json`
- `adventure.ink`
- `feedback.md`

Rules:

1. Artifact names are fixed and mandatory.
2. `canon.md` is the authoritative continuity source.
3. `scenes.json` is the authoritative scene-imaging manifest.
4. `adventure.ink` must conform to `canon.md` and `scenes.json`.
5. Critique handoff uses `feedback.md` only.
6. Do not introduce legacy files (`index.md`, `world.md`, `state.md`, `log/*`) for this workflow.

## Ask Setup Questions First

For a new story, ask exactly 4 setup questions before generating content:

1. What tone should the story use?
2. What setting should the story use?
3. Who is the protagonist?
4. How long/complex should the story be?

If the user already answered some items, ask only for missing items.

## Directory and File Initialization

Use a story directory rooted at user-provided path when available. If no path is given, default to:

- `~/.config/stories/<slug>/`

Slug rules:

- Lowercase letters, digits, and hyphens only.
- Replace spaces/punctuation with hyphens.
- Collapse repeated hyphens.
- Trim leading/trailing hyphens.

On new story creation, initialize `premise.md`, `outline.md`, `canon.md`, `scenes.json`, and `feedback.md` from `templates/`.
Create or refine `adventure.ink` by delegating to the `ink-story-writer` skill guidance.

## Four-Phase Pipeline

### Phase 1: Prewrite

Create and fill:

1. `premise.md`
2. `outline.md`
3. `canon.md`

Requirements:

- Premise is concise and goal-oriented.
- Outline includes major beats and branch intent.
- Canon defines immutable facts, constraints, character truth, and visual continuity anchors.
- Keep continuity-compatible with [`references/story-quality.md`](references/story-quality.md).

Visual continuity constraints to capture in `canon.md`:

- protagonist appearance and silhouette anchors,
- recurring locations and environmental anchors,
- recurring props, symbols, or creatures that must stay visually consistent,
- tone and palette direction,
- forbidden contradictions an image must never introduce.

### Phase 2: Scene Planning

Create and fill `scenes.json` after prewrite artifacts are stable and before critique or Ink build.

The manifest uses this fixed shape:

```json
{
  "storySlug": "example-story",
  "visualStyle": "storybook watercolor",
  "aspectRatio": "16:9",
  "scenes": [
    {
      "id": "opening-gate",
      "label": "Opening at the gate",
      "narrativePurpose": "Establish the protagonist, goal, and threat.",
      "sourceBeat": "Beat 1",
      "inkTarget": "start",
      "prompt": "Detailed image prompt here.",
      "negativePrompt": "modern clothing, text, watermark",
      "imageFilename": "opening-gate.png",
      "reuseOf": null
    }
  ]
}
```

Rules:

- Generate one planned image per narrative scene or beat, not per knot or stitch.
- Multiple Ink locations may reuse an earlier image by setting `reuseOf` to the original scene `id`.
- `imageFilename` must be normalized as `<scene-id>.png`.
- Use one story-level visual style across all scenes.
- Default `aspectRatio` to `16:9` unless the user requests another format.
- `inkTarget` must point at the scene entrypoint where the image first appears in `adventure.ink`.
- Every planned scene must have a concrete narrative purpose and a continuity-safe prompt.

Image generation rules:

- Use the `nano-banana` skill for all scene-image generation.
- Write scene images to `${STORIES_DIR:-./stories}/<slug>/images/`.
- Use `scenes.json` as the source of truth for prompt text, reuse, and filenames.
- If generation is blocked or unavailable, still produce `scenes.json`, keep stable image paths for later fulfillment, and record the blocked step in `feedback.md`.

### Phase 3: Critique (Background Agent)

Invoke the separate `story-critic` skill as a background pass.

Inputs:

- `premise.md`
- `outline.md`
- `canon.md`
- `scenes.json`
- optional draft `adventure.ink`

Output:

- `feedback.md` with required headings:
  - `## Continuity`
  - `## Choice Quality`
  - `## Pacing`
  - `## Tone`
  - `## Scene Imagery`
  - `## Ink Structure`
  - `## Actionable Fixes`
  - `## Ink Compile Report`

The critique stage proposes changes; it does not rewrite story files directly unless explicitly requested.

### Phase 4: Build (Ink Construction)

Generate or refine `adventure.ink` using prewrite artifacts, `scenes.json`, and critique feedback.

When authoring or fixing Ink DSL details (knot/stitch structure, diverts, list/state modeling, compile remediation), delegate to the `ink-story-writer` skill guidance.

Image wiring rules:

- Each planned scene entrypoint named by `inkTarget` must emit exactly one `# IMAGE: /stories/<slug>/images/<imageFilename>` tag before scene prose continues.
- Insert the image tag at the first paragraph of the scene entrypoint.
- If `reuseOf` is set, reuse the original scene image path instead of generating a duplicate file.
- Do not invent ad hoc image filenames or image locations outside `scenes.json`.
- If image generation did not run, keep the stable `# IMAGE:` path in Ink anyway so the story remains viewer-ready.

Compile checkpoints (Node Ink toolchain):

1. Draft checkpoint: compile after initial `adventure.ink` draft.
2. Final checkpoint: compile again after critique-driven revisions.

At each checkpoint:

- Record compile status in `feedback.md` under `## Ink Compile Report`.
- Include command run, pass/fail result, and errors/warnings summary.

Completion export for web viewer:

1. When the story is marked finished, compile `adventure.ink` to a viewer-consumable JSON file.
2. Resolve output directory from `STORIES_DIR` if set; otherwise use `./stories`.
3. Write compiled output as `<output-dir>/<slug>.json`.
4. Write scene images as `<output-dir>/<slug>/images/<scene-id>.png`.
5. Record the final compiled output path and image output directory in `feedback.md` under `## Ink Compile Report`.

## Ink Compilation Guidance

Use the Ink Node toolchain for compile validation.

Recommended command patterns:

```bash
npx inklecate -o story.json adventure.ink
```

```bash
npx inklecate -o "${STORIES_DIR:-./stories}/<slug>.json" adventure.ink
```

Notes:

- The generated JSON is build output and not part of the required artifact contract.
- Generated scene images are build output and not part of the required artifact contract.
- Compilation issues should be summarized in `feedback.md`.

## Quality and Continuity Checks

Before finalizing build phase:

1. Confirm all branch-critical facts in `adventure.ink` match `canon.md`.
2. Confirm each `inkTarget` in `scenes.json` maps to a real scene entrypoint in `adventure.ink`.
3. Confirm `IMAGE:` tags use the exact viewer path derived from `scenes.json`.
4. Confirm choice branches are meaningfully distinct.
5. Confirm protagonist goal and stakes remain clear.
6. Confirm tone is consistent with setup and scene imagery.

Apply the quality bar in [`references/story-quality.md`](references/story-quality.md).

## Resume Behavior

When continuing an existing story directory:

1. Load all six required artifacts.
2. If `premise.md`, `outline.md`, `canon.md`, `scenes.json`, or `feedback.md` are missing, create them from templates and annotate assumptions in `feedback.md`.
3. If `adventure.ink` is missing, regenerate it via `ink-story-writer` from prewrite artifacts, `scenes.json`, and critique notes.
4. If `scenes.json` exists but `adventure.ink` lacks matching `IMAGE:` tags, repair the tag wiring during the build phase.
5. Continue from current `adventure.ink` plus latest critique notes.

## Player-Facing Behavior

Treat file management and process stages as internal details unless the user asks for implementation details.

When user wants narrative output, stay in storyteller mode and avoid process narration.
