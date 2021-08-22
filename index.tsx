import React from "react";

export interface Override<T> {
  /** Hook to get the current value of the overridable value. */
  useValue: () => T;
  /**
   * Component used to override the value.
   *  This is like Context.Provider with the exception that the
   * `with` prop gets passed the existing value so you can delegate to
   * the existing value as needed.
   */
  Override: React.FC<{
    with: (t: T) => T;
    children: React.ReactNode;
  }>;
}

export const createOverride = <T,>(defaultValue: T): Override<T> => {
  const Context = React.createContext(defaultValue);
  return {
    useValue: () => React.useContext(Context),
    Override: (props) => {
      const oldValue = React.useContext(Context);
      const newValue = props.with(oldValue);
      return (
        <Context.Provider value={newValue}>{props.children}</Context.Provider>
      );
    },
  };
};
