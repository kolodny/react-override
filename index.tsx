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
   *     const extractor = ApiOverride.createExtractor();
   *     const { rendered } = render(<extractor.Element children={<Thing />} />);
   *
   *     rendered.getByText('load more').click();
   *     expect(rendered).toHaveMoreElements();
   *     const loadMore = extractor.value.loadMore;
   *     extractor.value.loadMore = () => { throw new Error('no network'); };
   *     rendered.getByText('load more').click();
   *     expect(rendered).toError();
   *     extractor.value.loadMore = loadMore;
   *     rendered.getByText('load more').click();
   *     expect(rendered).toHaveMoreElements();
   */
  createExtractor: () => {
    Element: React.FC<{
      with?: (t: T) => T;
      children: React.ReactNode;
    }>;
    extracted: T;
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
    createExtractor: () => {
      let extracted!: T;
      return {
        Element: (props) => (
          <Override.Override
            with={(value) => {
              extracted = props.with ? props.with(value) : value;
              return extracted;
            }}
          >
            {props.children}
          </Override.Override>
        ),
        get extracted() {
          return extracted;
        },
      };
    },
  };
  return Override;
};
