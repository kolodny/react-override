import React from 'react';

export const isInNode =
  typeof process === 'object' &&
  Object.prototype.toString.call(process).slice(8, -1) === 'process';

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
   *
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
    /** Forces the component to update. Useful when you changed the return value of a function or spy */
    forceUpdate: () => Promise<void>;
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
      let forceUpdater: (v: any) => void;
      let resolver: undefined | (() => void);
      return {
        Override: (props) => {
          const [, force] = React.useState({});
          React.useEffect(() => {
            resolver?.();
            resolver = undefined;
          });
          React.useEffect(() => {
            forceUpdater = force;
            unmounted = false;
            return () => void (unmounted = true);
          }, []);

          // This function allows us to force the entire component tree to update.
          const recursiveClone = (
            children: React.ReactNode
          ): React.ReactNode => {
            return React.Children.map(children, (child) => {
              if (React.isValidElement<any>(child)) {
                return React.cloneElement(child, {
                  children: recursiveClone(child.props.children),
                });
              } else {
                return child;
              }
            });
          };
          return (
            <Override.Override
              with={(value) => {
                current = props.with ? props.with(value) : value;
                return current;
              }}
            >
              {recursiveClone(props.children)}
            </Override.Override>
          );
        },
        get current() {
          if (unmounted && !isInNode) {
            throw new Error(
              'Attempted to get current value when Element is not rendered'
            );
          }
          return current;
        },
        forceUpdate: () => {
          if (unmounted) {
            throw new Error(
              'Attempted to force update when Element is not rendered'
            );
          }
          return new Promise<void>((resolve) => {
            resolver = resolve;
            forceUpdater({});
          });
        },
      };
    },
  };
  return Override;
};
