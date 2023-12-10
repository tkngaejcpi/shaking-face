import { Effect, Context } from "effect";
import * as kv from "idb-keyval";

/* declare service context for VocabStore */
declare module "@services/ServiceContext" {
  interface ServiceContext {
    vocabStore: Service<VocabStore>;
  }
}

export enum VocabListError {
  InternalError,
  CannotCreateAnExistingVocab,
  CannotIncreaseANonExistingVocab,
  CannotDeleteANonExistingVocab,
}

export interface VocabStore {
  readonly complete: (
    s: string,
  ) => Effect.Effect<never, VocabListError, VocabFreq[]>;

  readonly new: (s: string) => Effect.Effect<never, VocabListError, void>;
  readonly increase: (s: string) => Effect.Effect<never, VocabListError, void>;
  readonly del: (s: string) => Effect.Effect<never, VocabListError, void>;
}

export const VocabStore = Context.Tag<VocabStore>();

/* a helper to pass thur error */
const passThurError = (e: unknown) => {
  if (
    e == VocabListError.CannotCreateAnExistingVocab ||
    e == VocabListError.CannotIncreaseANonExistingVocab
  ) {
    return e as VocabListError;
  }

  return VocabListError.InternalError;
};

/**
 * @description [Vocab, VocabFreq]
 */
export type VocabFreq = [string, number];

/**
 * @description a {@link VocabStore} impl from IndexedDB
 */
export const IDBImplVocabStore = VocabStore.of({
  complete: (s) =>
    Effect.tryPromise({
      try: async () => {
        const vocabFreq: VocabFreq[] = await kv.entries();

        return vocabFreq
          .filter(([vocab]) => vocab.startsWith(s))
          .sort(([, freqA], [, freqB]) => freqB - freqA)
          .slice(0, 10);
      },
      catch: passThurError,
    }),

  new: (vocab) =>
    Effect.tryPromise({
      try: async () => {
        const freq: VocabFreq[1] | undefined = await kv.get(vocab);

        /* if vocab definded, throw error */
        if (freq) {
          throw VocabListError.CannotCreateAnExistingVocab;
        }

        /* create new vocab */
        kv.set(vocab, 1);
      },
      catch: passThurError,
    }),

  increase: (vocab) =>
    Effect.tryPromise({
      try: async () => {
        const freq: VocabFreq[1] | undefined = await kv.get(vocab);

        /* if vocab not definded, throw error */
        if (freq == undefined) {
          throw VocabListError.CannotIncreaseANonExistingVocab;
        }

        /* increase freq */
        kv.set(vocab, freq + 1);
      },
      catch: passThurError,
    }),

  del: (vocab) =>
    Effect.tryPromise({
      try: async () => {
        /* if vocab not definded, throw error */
        if ((await kv.get(vocab)) == undefined) {
          throw VocabListError.CannotDeleteANonExistingVocab;
        }

        /* increase freq */
        kv.del(vocab);
      },
      catch: passThurError,
    }),
});

/**
 * @description require {@link VocabStore}
 * @description an action that take a string of vocab,
 * and return a completion list of potential vocab
 */
export const completeInput = (s: string) =>
  Effect.gen(function* (_) {
    const vcl = yield* _(VocabStore);

    const completions = yield* _(vcl.complete(s));
    return completions;
  });

/**
 * @description require {@link VocabStore}
 * @description an action that take a string of vocab,
 * and add it into the vocab store
 */
export const createNewVocab = (s: string) =>
  Effect.gen(function* (_) {
    const vcl = yield* _(VocabStore);

    yield* _(vcl.new(s));
  });

export const increaseVocabFreq = (vocab: string) =>
  Effect.gen(function* (_) {
    const vcl = yield* _(VocabStore);

    yield* _(vcl.increase(vocab));
  });

export const deleteVocab = (vocab: string) =>
  Effect.gen(function* (_) {
    const vcl = yield* _(VocabStore);

    yield* _(vcl.del(vocab));
  });
