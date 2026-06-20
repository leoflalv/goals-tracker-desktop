---
name: "OPSX: Apply"
description: Implement tasks from an OpenSpec change (Experimental)
category: Workflow
tags: [workflow, artifacts, experimental]
---

Implement tasks from an OpenSpec change.

**Input**: Optionally specify a change name (e.g., `/opsx:apply add-auth`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `openspec list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., `/opsx:apply <other>`).

2. **Check status to understand the schema**
   ```bash
   openspec status --change "<name>" --json
   ```
   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - `planningHome`, `changeRoot`, and `actionContext`: planning scope and edit constraints
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

3. **Get apply instructions**

   ```bash
   openspec instructions apply --change "<name>" --json
   ```

   This returns:
   - `contextFiles`: artifact ID -> array of concrete file paths (varies by schema)
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If `state: "blocked"` (missing artifacts): show message, suggest using `/opsx:continue`
   - If `state: "all_done"`: congratulate, suggest archive
   - Otherwise: proceed to implementation

   **Workspace guard:** If status JSON reports `actionContext.mode: "workspace-planning"` and `allowedEditRoots` is empty, explain that full workspace apply is not supported in this slice. Treat linked repos and folders as read-only context, ask the user to select an affected area through an explicit implementation workflow, and STOP before editing files.

4. **Read context files**

   Read every file path listed under `contextFiles` from the apply instructions output.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks
   - Other schemas: follow the contextFiles from CLI output

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

6. **Identify specs and their tasks**

   From `contextFiles`, list the spec files in the change (e.g., `specs/<spec-name>/spec.md`).
   Parse `tasks.md` to map tasks to their spec — tasks are organized under section headers that correspond to spec names.
   If task-to-spec mapping is ambiguous, announce the mapping you infer and ask for confirmation.

   Show the implementation plan upfront:
   ```
   Specs to implement:
   1. <spec-name-a> (N tasks)
   2. <spec-name-b> (M tasks)
   ...
   ```

7. **Implement one spec at a time**

   For each pending spec, in order:

   a. **Create a git branch for the spec**
      ```bash
      git checkout -b feature/<change-name>-<spec-name>
      ```
      `<spec-name>` is the spec's directory name in kebab-case (e.g., `habit-management`).
      Announce: "Created branch: `feature/<change-name>-<spec-name>`"

   b. **Read the spec file** before implementing its tasks, so all code decisions align with the spec.

   c. **Implement all tasks for this spec**
      - Tasks within a spec may be organized into sub-groups for clarity — implement them in order
      - Show which task is being worked on
      - Make the code changes required
      - Keep changes minimal and focused
      - Mark task complete in tasks.md: `- [ ]` → `- [x]`

   d. **After completing the spec, pause and report**
      ```
      ## Spec Complete: <spec-name>

      Branch: feature/<change-name>-<spec-name>
      Tasks completed: N
      Files changed: <list>

      Review the changes on this branch. When ready, reply to continue with the next spec.
      ```
      **Wait for the user to respond before starting the next spec.**

   **Pause mid-spec if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

8. **On full completion, show status**

   Display:
   - All specs and tasks completed
   - Overall progress: "N/M tasks complete"
   - Suggest archive with `/opsx:archive`

**Output During Implementation**

```
## Implementing: <change-name> (schema: <schema-name>)

Specs to implement:
1. habit-management (3 tasks)
2. habit-ui (4 tasks)

---

### Spec 1/2: habit-management
Branch: feature/<change-name>-habit-management

Working on task 1/3: <task description>
[...implementation...]
✓ Task complete

Working on task 2/3: <task description>
[...implementation...]
✓ Task complete
```

**Output On Spec Completion (pause point)**

```
## Spec Complete: <spec-name>

Branch: feature/<change-name>-<spec-name>
Tasks completed: 3/3
Files changed:
- src/features/goals/domain/Goal.ts
- src-tauri/src/lib.rs

Review the changes on this branch. When ready, reply to continue with the next spec.
```

**Output On Full Completion**

```
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓

### Specs Completed
- [x] habit-management (branch: feature/<change-name>-habit-management)
- [x] habit-ui (branch: feature/<change-name>-habit-ui)

All tasks complete! You can archive this change with `/opsx:archive`.
```

**Output On Pause (Issue Encountered)**

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete (spec: habit-ui, task 1/4)

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Update task checkbox immediately after completing each task
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles from CLI output, don't assume specific file names

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly
