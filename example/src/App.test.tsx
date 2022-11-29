import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import App from './App';
import { Film, Person, SwapiOverride } from './swapi';
import { createOverride } from 'react-override';

// @testing-library/react is weird about many things updating and fails too early.
const myWaitFor = (cb: () => void) => {
  return waitFor(cb, { timeout: 2000 });
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

test('using the overide api with no errors', async () => {
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
  const swapiRef = SwapiOverride.createRef();
  const { getByText } = render(
    <swapiRef.Override>
      <App />
    </swapiRef.Override>
  );
  const getPerson = swapiRef.current.getPerson;
  swapiRef.current.getPerson = async (id) => {
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

test('forceUpdate', async () => {
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
    <UseState.Override>
      My Cool Component
      <span>
        <Component />
      </span>
    </UseState.Override>
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
