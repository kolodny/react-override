import React from 'react';

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
  /**
   * Create an extractor component.
   * This allows you to "pull out" the override value to manipulate during a test.
   * For example:
   *     const apiRef = ApiOverride.createRef();
   *     const { rendered } = render(<apiRef.Override children={<Thing />} />);
   *
   *     rendered.getByText('load more').click();
   *     expect(rendered).toHaveMoreElements();
   *     const loadMore = apiRef.value.loadMore;
   *     apiRef.value.loadMore = () => { throw new Error('no network'); };
   *     rendered.getByText('load more').click();
   *     expect(rendered).toError();
   *     apiRef.value.loadMore = loadMore;
   *     rendered.getByText('load more').click();
   *     expect(rendered).toHaveMoreElements();
   */
  createRef: () => {
    Override: React.FC<{
      with?: (t: T) => T;
      children: React.ReactNode;
    }>;
    /** Gets the currently mounted value of the override. Throws if the element is not rendered. */
    current: T;
  };
}

export const createOverride = <T,>(defaultValue: T): Override<T> => {
  const Context = React.createContext(defaultValue);
  const Override: Override<T> = {
    useValue: () => React.useContext(Context),
    Override: (props) => {
      const oldValue = React.useContext(Context);
      const newValue = props.with(oldValue);
      return (
        <Context.Provider value={newValue}>{props.children}</Context.Provider>
      );
    },
    createRef: () => {
      let unmounted = true;
      let current: T;
      return {
        Override: (props) => {
          React.useEffect(() => {
            unmounted = false;
            return () => void (unmounted = true);
          }, []);
          return (
            <Override.Override
              with={(value) => {
                current = props.with ? props.with(value) : value;
                return current;
              }}
            >
              {props.children}
            </Override.Override>
          );
        },
        get current() {
          if (unmounted) {
            throw new Error(
              'Attempted to get current value when Element is not rendered'
            );
          }
          return current;
        },
      };
    },
  };
  return Override;
};
