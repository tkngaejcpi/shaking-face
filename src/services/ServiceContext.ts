import { createContext } from "react";

import { Context } from "effect";

import { VocabStore, IDBImplVocabStore } from "@services/VocabStore";

/**
 * @description a container type of service
 */
export interface Service<A> {
  tag: Context.Tag<A, A>;
  impl: A;
}

/**
 * @description empty interface in default,
 * use `declare` to extends this interface
 */
export interface ServiceContext {}

/**
 * @description a context of react to use effect
 */
export const ServiceContext = createContext<ServiceContext>({
  vocabStore: {
    tag: VocabStore,
    impl: IDBImplVocabStore,
  },
});
