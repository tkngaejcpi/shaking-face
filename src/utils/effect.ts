import { Effect } from "effect";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * @param set a react state setter
 * @returns an effect operator that set react state,
 * it will not return the value, if you want to keep it, use this with `tap`.
 */
export const setState =
  <R, E, A>(
    set: SetState<A>,
  ): ((self: Effect.Effect<R, E, A>) => Effect.Effect<R, E, void>) =>
  (self) =>
    Effect.gen(function* (_) {
      const value = yield* _(self);
      set(value);
    });
