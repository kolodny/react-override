import React from 'react';

type PropsWithChildren<P = unknown> = P & { children?: React.ReactNode };

export interface Override<T> {
  /** Hook to get the current value of the overridable value. */
  useValue: () => T;
  /**
   * Component used to override the value.
   *  This is like Context.Provider with the exception that the
   * `with` prop gets passed the existing value so you can delegate to
   * the existing value as needed.
   */
  Override: React.FC<PropsWithChildren<{ with: (old: T) => T }>>;
  /** Bind override value late. Use this when you need to declare your overrides in a separate file due to import limitations. */
  bind: (callback: (value: T) => T) => void;
  /**
   * Create an extractor component.
   * This allows you to "pull out" the override value to manipulate during a test.
   * For example:
   *
   *     const ApiRef = ApiOverride.createRef();
   *     const { rendered } = render(<ApiRef><Thing /></ApiRef>);
   *
   *     rendered.getByText('load more').click();
   *     expect(rendered).toHaveMoreElements();
   *     const loadMore = ApiRef.current.loadMore;
   *     ApiRef.current.loadMore = () => { throw new Error('no network'); };
   *     rendered.getByText('load more').click();
   *     expect(theError).toHaveHappened(); // Not real code, but you get the idea.
   *     ApiRef.current.loadMore = loadMore;
   *     rendered.getByText('load more').click();
   *     expect(rendered).toHaveMoreElements();
   */
  createRef: (withValue?: (t: T) => T) => React.FC<PropsWithChildren> & {
    /** Gets the currently mounted value of the override. */
    current: T;
    /** Waits for the element to render, will timeout with a rejection after `timeoutMs` if provided. */
    waitForRender: (timeoutMs?: number) => Promise<void>;
    /** Forces the component to update. Useful when you changed the return value of a function or spy */
    forceUpdate: () => Promise<void>;
  };
}

export const configureCreateOverride =
  (warnOnUnmountedCurrent = true) =>
  <T,>(defaultValue: T): Override<T> => {
    const bounds: Array<(value: T) => T> = [];
    const Context = React.createContext({
      value: defaultValue,
      version: 0,
    });
    const useValue = () => {
      const context = { ...React.useContext(Context) };

      if (context.version === 0) {
        for (const bound of bounds) {
          context.value = bound(context.value);
          context.version++;
        }
      }
      return context;
    };
    const Override: Override<T> = {
      useValue: () => useValue().value,
      Override: (props) => {
        const old = useValue();
        let value = old.value;
        const newValue = {
          value: props.with(value),
          version: old.version + 1,
        };
        return (
          <Context.Provider value={newValue}>{props.children}</Context.Provider>
        );
      },
      bind: (callback) => bounds.push(callback),
      createRef: (withValue) => {
        let unmounted = true;
        let ref: { current: T } | undefined = undefined;
        let incrementVersion: () => void;
        let resolver: undefined | (() => void);
        let initialRenderDeferred: any = {};
        initialRenderDeferred.promise = new Promise((resolve, reject) => {
          initialRenderDeferred.resolve = resolve;
          initialRenderDeferred.reject = reject;
        });

        const Provider: ReturnType<Override<T>['createRef']> = ((
          props: any
        ) => {
          React.useEffect(() => {
            resolver?.();
            resolver = undefined;
            initialRenderDeferred?.resolve();
            initialRenderDeferred = undefined;
          });
          React.useEffect(() => {
            incrementVersion = () => setVersion((t) => t + 1);
            unmounted = false;
            return () => void (unmounted = true);
          }, []);

          const oldValue = React.useContext(Context);
          if (!ref) {
            ref = {
              current: withValue ? withValue(oldValue.value) : oldValue.value,
            };
          }
          const [version, setVersion] = React.useState(oldValue.version + 1);
          const newValue = {
            value: ref.current,
            version: version + 1,
          };

          return (
            <Context.Provider value={newValue}>
              {props.children}
            </Context.Provider>
          );
        }) as any;

        Provider.waitForRender = async (timeout?: number) => {
          if (!initialRenderDeferred?.promise) return;
          if (!timeout) return initialRenderDeferred.promise;
          return Promise.race([
            initialRenderDeferred.promise,
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error('waitForRender timed out')),
                timeout
              )
            ),
          ]);
        };

        Object.defineProperty(Provider, 'current', {
          get: () => {
            if (unmounted && warnOnUnmountedCurrent) {
              console.error(
                'Attempted to get current value when Element is not rendered. Do you forget to `waitForRender()`?'
              );
            }
            return ref?.current!;
          },
        });

        Provider.forceUpdate = () => {
          if (unmounted) {
            throw new Error(
              'Attempted to force update when Element is not rendered'
            );
          }
          return new Promise<void>((resolve) => {
            resolver = resolve;
            incrementVersion();
          });
        };

        return Provider;
      },
    };
    return Override;
  };

export const createOverride = configureCreateOverride();
