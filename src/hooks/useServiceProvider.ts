import { useContext } from "react";

import { Effect } from "effect";

import { ServiceContext } from "@services/ServiceContext";

type ServiceKey = keyof ServiceContext;

export const useServiceProvider = <Key extends ServiceKey>(key: Key) => {
  const service = useContext(ServiceContext)[key];

  return <R, E, A>(eff: Effect.Effect<R, E, A>) =>
    Effect.provideService(eff, service.tag, service.impl);
};
