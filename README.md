# story-adventure

`story-adventure` is an Agent Skill for Codex and similar agents that runs an Ink-first story composition workflow.

The workflow:

- generates prewriting artifacts (`premise.md`, `outline.md`, `canon.md`)
- plans scene imagery in `scenes.json`
- runs a background critique stage via `story-critic`
- builds and refines `adventure.ink` with `IMAGE:` tags
- generates scene images for the finished story package through Nano Banana
- records review and compile outcomes in `feedback.md`

## Skill Location

Primary skill files:

- `skills/story-adventure/SKILL.md`
- `skills/story-adventure/references/story-quality.md`
- `skills/story-adventure/templates/`

Critic stub skill:

- `skills/story-critic/SKILL.md`

## Install In Codex

To install locally as a symlink:

```bash
ln -s /Users/ozzyonfire/Development/agents/story-adventure/skills/story-adventure ~/.codex/skills/story-adventure
```

Optional critic install:

```bash
ln -s /Users/ozzyonfire/Development/agents/story-adventure/skills/story-critic ~/.codex/skills/story-critic
```

If links already exist, replace them or update existing targets.

After installing, start a new Codex chat or restart Codex so skills are re-indexed.

## Required Story Artifacts

Each story directory uses a fixed file contract:

- `premise.md`
- `outline.md`
- `canon.md`
- `scenes.json`
- `adventure.ink`
- `feedback.md`

`canon.md` is the continuity source of truth. `scenes.json` is the scene-image source of truth.

## Ink Compile Checkpoints

Recommended Node command pattern:

```bash
npx inklecate -o story.json adventure.ink
```

Run compile checks at:

1. Draft checkpoint (initial `adventure.ink`)
2. Final checkpoint (post-critique revisions)

Log compile status, command, and error/warning summaries in `feedback.md` under `## Ink Compile Report`.

## Scene Images

Finished stories now include scene image planning and asset output:

- `scenes.json` defines one planned image per narrative scene or beat
- each scene maps to an Ink scene entrypoint via `inkTarget`
- `adventure.ink` should emit `# IMAGE: /stories/<slug>/images/<scene-id>.png` at each planned scene entrypoint
- scene images are generated with the `nano-banana` skill
- reused scenes point at the original image path through `reuseOf`

Default output layout:

- compiled story JSON: `stories/<slug>.json`
- generated scene images: `stories/<slug>/images/<scene-id>.png`

If image generation is blocked, the workflow still produces `scenes.json` and stable image paths in Ink, and records the blocked step in `feedback.md`.

## Development

Because Codex can load installed skills via symlink, edits in this repository are reflected immediately at `~/.codex/skills/...`. A fresh chat or app restart may still be needed before Codex picks up changes.

## Web Viewer

This repo includes a Vite web viewer for playing precompiled Ink stories with `inkjs`.

### Run

```bash
bun run dev
```

Optional environment variables:

- `STORIES_DIR` (default: `./stories`) - directory containing compiled Ink `.json` files and generated story image assets
- `PORT` (default: `3000`) - dev server port

The Vite server fails fast if `STORIES_DIR` is missing or unreadable.

### Compile Pipeline

Runtime does not compile `.ink` files. Compile stories ahead of time, for example:

```bash
npx inklecate -o stories/my-adventure.json adventure.ink
```

Generate scene images into the matching story asset directory, for example:

```bash
mkdir -p stories/my-adventure/images
gemini --yolo "/generate 'storybook watercolor opening scene, no text' --aspect=16:9"
```

### Pages and Endpoints

- `GET /` or `GET /index.html` story list page
- `GET /play.html?id=<story-id>` player page
- `GET /api/stories` list API
- `GET /stories/<filename>.json` compiled story JSON files served directly from `STORIES_DIR`
- `GET /stories/<slug>/images/<file>` story image assets served directly from `STORIES_DIR`

Player progress and theme are stored in browser `localStorage` per story.
