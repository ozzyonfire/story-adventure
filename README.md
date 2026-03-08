# story-adventure

`story-adventure` is an Agent Skill for Codex and similar agents that runs a persistent choose-your-own-adventure workflow.

The skill:

- asks a short set of setup questions
- creates a story outline and world state
- saves each story run as markdown files in a slugged folder
- tracks inventory, flags, quests, and scene history across turns

## Skill Location

The skill itself lives at [skills/story-adventure](/Users/ozzyonfire/Development/agents/story-adventure/skills/story-adventure).

Main files:

- `skills/story-adventure/SKILL.md`
- `skills/story-adventure/references/story-quality.md`

## Install In Codex

To install locally as a symlink:

```bash
ln -s /Users/ozzyonfire/Development/agents/story-adventure/skills/story-adventure ~/.codex/skills/story-adventure
```

If the link already exists, replace it or update the existing target.

After installing, start a new Codex chat or restart Codex so the skill is re-indexed.

## Story Save Layout

Each story run is stored under a configurable root, defaulting to `~/.config/stories/<slug>/`.

Expected files:

- `index.md`
- `outline.md`
- `world.md`
- `state.md`
- `log/scene-0001.md` and later scene files

## Development

Because Codex can load the installed skill via symlink, edits made in this repository are reflected immediately at `~/.codex/skills/story-adventure`. A fresh chat or app restart may still be needed before Codex picks up changes.
