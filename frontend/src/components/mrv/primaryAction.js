import { createContext, useContext, useEffect, useRef } from "react";

// Lets the active MRV tab register the handler for the dynamic header "Primary action".
const PrimaryActionContext = createContext({ set: () => {}, clear: () => {} });

export function PrimaryActionProvider({ children }) {
  const ref = useRef({ label: "Primary action", fn: () => {} });
  const listeners = useRef(new Set());
  const api = {
    ref,
    set: (label, fn) => { ref.current = { label, fn }; listeners.current.forEach((l) => l()); },
    subscribe: (l) => { listeners.current.add(l); return () => listeners.current.delete(l); },
  };
  return <PrimaryActionContext.Provider value={api}>{children}</PrimaryActionContext.Provider>;
}

export const usePrimaryActionApi = () => useContext(PrimaryActionContext);

// Called by a tab to register its primary action handler.
export function usePrimaryAction(label, fn) {
  const api = usePrimaryActionApi();
  useEffect(() => {
    api.set(label, fn);
    return () => api.set("Primary action", () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);
}
