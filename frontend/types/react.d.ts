declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
  
  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  export const Fragment: React.ExoticComponent<{ children?: React.ReactNode }>;
  export type ReactNode = React.ReactNode;
  export type FC<P = {}> = React.FunctionComponent<P>;
}