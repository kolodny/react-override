import '@testing-library/jest-dom';

import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import App from './App';
import { Film, Person, SwapiOverride } from './swapi';
import { createOverride } from 'react-override';

import { expect, test, vitest } from 'vitest';

vitest.setConfig({ testTimeout: 30000 });

const myWaitFor = (cb: () => void) => {
  return waitFor(cb, { timeout: 30000 });
};

test('using the regular api with no errors', async () => {
  const { getByText } = render(<App />);
  await myWaitFor(() => expect(getByText('Films:')).toBeInTheDocument());
  await myWaitFor(() => expect(getByText('People:')).toBeInTheDocument());
});

test('using the regular api with people errors', async () => {
  const { getByText } = render(
    <SwapiOverride.Override
      with={(swapi) => {
        return {
          ...swapi,
          getPeople: async () => Promise.reject(new Error()),
        };
      }}
    >
      <App />
    </SwapiOverride.Override>
  );
  await myWaitFor(() =>
    expect(getByText('Error loading people')).toBeInTheDocument()
  );
  await myWaitFor(() => expect(getByText('Films:')).toBeInTheDocument());
});

test('using the override api with no errors', async () => {
  const { getByText } = render(
    <SwapiOverride.Override
      with={(swapi) => {
        return {
          ...swapi,
          getFilms: async () => [
            {
              title: 'Some title',
              url: '1',
            } as Film,
          ],
          getPeople: async () => [
            {
              name: 'Luke Skyguy',
              url: '1',
            } as Person,
          ],
        };
      }}
    >
      <App />
    </SwapiOverride.Override>
  );
  await myWaitFor(() => expect(getByText('Films:')).toBeInTheDocument());
  await myWaitFor(() => expect(getByText('Luke Skyguy')).toBeInTheDocument());
});

test('Nested overrides', async () => {
  const { getByText } = render(
    // LEVEL 1
    <SwapiOverride.Override
      with={(swapi) => {
        return {
          ...swapi,
          getFilms: async () => [],
          getPeople: async () => [
            {
              name: 'Luke Skyguy',
              url: '1',
            } as Person,
          ],
        };
      }}
    >
      {/* LEVEL 2 */}
      <SwapiOverride.Override
        with={(swapi) => {
          return {
            ...swapi,
            getPeople: async () =>
              (await swapi.getPeople()).map((person) => ({
                ...person,
                name: `${person.name.toUpperCase()}!!`,
              })),
          };
        }}
      >
        <App />
      </SwapiOverride.Override>
    </SwapiOverride.Override>
  );
  await myWaitFor(() => expect(getByText('Films:')).toBeInTheDocument());
  await myWaitFor(() => expect(getByText('LUKE SKYGUY!!')).toBeInTheDocument());
});

test('createRef', async () => {
  const SwapiRef = SwapiOverride.createRef((a) => a);
  const { getByText } = render(
    <SwapiRef>
      <App />
    </SwapiRef>
  );
  const getPerson = SwapiRef.current.getPerson;
  SwapiRef.current.getPerson = async (id) => {
    if (id === '1') {
      return {
        name: 'Luke Loaded',
        planet: 'Tatooine Loaded',
      };
    }
    return getPerson(id);
  };
  getByText('Click to load person').click();
  await myWaitFor(() =>
    expect(getByText('Luke Loaded', { exact: false })).toBeInTheDocument()
  );
});

test.skip('forceUpdate', async () => {
  let overridden = React.useState;
  const useState = createOverride(() => overridden);
  const UseState = useState.createRef();
  const Component: React.FunctionComponent = () => {
    const [count, setCount] = useState.useValue()()(0);
    React.useState(0); // To keep us honest that we didn't break the rules of hooks.
    return (
      <>
        {count}
        <button onClick={() => setCount(count + 1)}>Inc</button>
      </>
    );
  };
  const { getByText } = render(
    <UseState>
      My Cool Component
      <span>
        <Component />
      </span>
    </UseState>
  );

  expect(getByText('0')).toBeInTheDocument();
  getByText('Inc').click();
  expect(getByText('1')).toBeInTheDocument();
  const oldValue = UseState.current();
  let called = false;
  overridden = () => {
    const [value] = oldValue();
    return [value! + 100, () => (called = true)];
  };

  await act(() => UseState.forceUpdate());
  expect(called).toBe(false);

  expect(getByText('101')).toBeInTheDocument();

  getByText('Inc').click();
  expect(called).toBe(true);
  expect(getByText('101')).toBeInTheDocument();
});

test.skip('waitForRender', async () => {
  const info = createOverride({ foo: 123 });
  const Info = info.createRef(() => ({ foo: 321 }));
  const Host = (props: React.PropsWithChildren) => {
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
      setTimeout(() => {
        setShow(true);
      }, 1000);
    }, []);
    return <>{show ? props.children : 'Loading...'}</>;
  };
  const Component: React.FunctionComponent = () => {
    const { foo } = info.useValue();
    return <>Foo is {foo}</>;
  };
  const { queryByText } = render(
    <Host>
      <Info>
        My Cool Component
        <span>
          <Component />
        </span>
      </Info>
    </Host>
  );

  expect(queryByText('Loading...')).toBeInTheDocument();
  expect(queryByText('0')).not.toBeInTheDocument();
  await act(() => Info.waitForRender());
  expect(queryByText('Loading...')).not.toBeInTheDocument();
  expect(queryByText('Foo is 321')).toBeInTheDocument();
});
