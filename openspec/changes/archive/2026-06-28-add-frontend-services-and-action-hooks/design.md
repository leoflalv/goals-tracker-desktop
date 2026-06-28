## Context

The Rust backend has four Tauri commands registered: `create_goal`, `get_goals`, `update_goal`, `delete_goal`. They operate over a SQLite-backed `goals` table. The frontend (`App.tsx`) is a bare shell — no feature folders, no `invoke()` calls, no types.

The project architecture (CLAUDE.md) mandates a four-layer structure per feature: `domain/` → `services/` → `actions/` → `components/`. This change populates the first three layers for `goals`.

## Goals / Non-Goals

**Goals:**
- Typed `Goal` domain interface mirroring the Rust struct
- Zod DTO schema in `goalDto.ts` that validates raw backend payloads and maps them to the domain type
- Thin service functions wrapping each `invoke()` call, running DTO validation before returning domain types
- Four React hooks — one per operation — exposing loading, error, and data/result state
- Zero UI components (those belong to a separate change)

**Non-Goals:**
- Global state management (Zustand, Redux, Context) — hooks own their local state
- Optimistic updates — mutations re-fetch after success
- Pagination or filtering on `get_goals`
- Any Rust-side changes

## Decisions

### 1. One service function per Tauri command
Each command maps to a single async function in `goalService.ts` with a typed signature. Keeping them flat (not grouped in a class) aligns with the existing module pattern and makes tree-shaking trivial.

*Alternative considered*: A class-based service — rejected because it adds boilerplate and doesn't compose well with hooks.

### 2. One hook per operation (not a single `useGoals` mega-hook)
CLAUDE.md explicitly names `useGetGoals` and `useCreateGoal` as canonical examples. This keeps each hook small and independently importable.

*Alternative considered*: `useGoals` returning all operations — rejected because it forces all consumers to import all operations even when only one is needed.

### 3. No try/catch blocks — `tryCatch` + `safeParse` inside services, `tryCatch` in hooks
Service functions return plain data (`Promise<Goal[]>`, `Promise<Goal>`, `Promise<void>`) and throw on error — their public API is unchanged. Internally, instead of try/catch blocks, they use two mechanisms:

1. `tryCatch(promise)` from `src/shared/utils/result.ts` — wraps an `invoke()` call into a `readonly [T, null] | readonly [null, Error]` tuple. The service destructures and rethrows: `const [raw, err] = await tryCatch(invoke(...)); if (err) throw err;`
2. `schema.safeParse(raw)` — returns `{ success, data, error }` instead of throwing. The service checks `if (!parsed.success) throw parsed.error`.

Hooks call services via the same `tryCatch` utility: `const [goals, err] = await tryCatch(getGoals())`. This means no try/catch syntax anywhere in the codebase.

*Alternative considered*: try/catch in each service function — rejected because it is repetitive boilerplate and obscures which lines can fail.

### 4. TanStack Query manages all server state in hooks
`useGetGoals` uses `useQuery`; the three mutation hooks use `useMutation`. TanStack Query owns loading, error, and caching state — hooks no longer need `useState`/`useEffect`. On every successful mutation, `queryClient.invalidateQueries({ queryKey: goalsQueryKey })` automatically re-fetches the goals list. A `goalsQueryKey` constant is exported from `goalService.ts` as the single source of truth for the cache key.

*Alternative considered*: Manual `useState`/`useEffect` — rejected because it requires manual loading/error tracking, and coordinating refetch after mutations requires passing callbacks between hooks.

### 6. Mutation hooks accept an optional `onSuccess` callback
After a successful mutation, the `useMutation` definition invalidates the goals query (automatic refetch) and the per-call `onSuccess` callback is invoked for component-specific side effects (e.g., closing a modal). These two concerns are intentionally separated: the hook always invalidates; the component decides what else to do.

### 5. Goal type lives in `domain/Goal.ts`, re-exported from `domain/index.ts`
Follows the feature architecture. Service and action layers import from `@/features/goals/domain`.

### 6. Zod DTO validation at the service boundary, co-located in `goalDto.ts`
Each response from `invoke()` passes through `GoalSchema.parse()` (or `GoalSchema.array().parse()`) before the service function returns. If the backend shape ever diverges from what the frontend expects, a `ZodError` is thrown immediately at the boundary rather than silently producing undefined fields deep in the UI.

The DTO file (`src/features/goals/services/goalDto.ts`) owns three things: the Zod schema, the inferred `GoalDto` type, and a `toGoal(dto: GoalDto): Goal` map function. Keeping schema + mapper together avoids the schema and mapping logic drifting apart. The service file stays clean: call `invoke`, parse through DTO, map to domain.

*Alternative considered*: Inline `z.object()` directly in the service functions — rejected because it scatters schema definitions and makes them harder to test in isolation.

*Alternative considered*: Place DTO in `domain/` — rejected because DTOs are an artefact of the data-access boundary (they describe the raw IPC payload), not pure domain concepts.

## Risks / Trade-offs

- [No global cache] Each component tree that mounts `useGetGoals` independently issues its own fetch. → Mitigation: acceptable at this scale; a shared cache can be added later if needed.
- [Tauri IPC errors are strings] The Rust handlers return `Result<_, String>`. Service functions propagate them as thrown strings; hooks catch and store them in an `error` field. → Mitigation: wrap in `Error` objects at the service boundary for consistent handling.
- [Zod parse cost] Parsing every backend response adds a small runtime cost. → Mitigation: negligible for the expected payload sizes (a handful of goal objects); this is a widget app, not a high-throughput data grid.
- [Schema drift] If the Rust `Goal` struct gains or renames a field and `goalDto.ts` is not updated, `GoalSchema.parse()` will throw at runtime. → Mitigation: this is the desired behavior — it surfaces the mismatch immediately rather than silently serving stale or malformed data.

## Migration Plan

New files only — no existing files are modified. No migration needed.
