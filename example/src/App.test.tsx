import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";
import { Film, Person, SwapiOverride } from "./swapi";

// @testing-library/react is weird about many things updating and fails too early.
const myWaitFor = (cb: () => void) => {
  return waitFor(cb, { timeout: 2000 });
};

test("using the regular api with no errors", async () => {
  const { getByText } = render(<App />);
  await myWaitFor(() => expect(getByText("Films:")).toBeInTheDocument());
  await myWaitFor(() => expect(getByText("People:")).toBeInTheDocument());
});

test("using the regular api with people errors", async () => {
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
    expect(getByText("Error loading people")).toBeInTheDocument()
  );
  await myWaitFor(() => expect(getByText("Films:")).toBeInTheDocument());
});

test("using the overide api with no errors", async () => {
  const { getByText } = render(
    <SwapiOverride.Override
      with={(swapi) => {
        return {
          ...swapi,
          getFilms: async () => [
            {
              title: "Some title",
              url: "1",
            } as Film,
          ],
          getPeople: async () => [
            {
              name: "Luke Skyguy",
              url: "1",
            } as Person,
          ],
        };
      }}
    >
      <App />
    </SwapiOverride.Override>
  );
  await myWaitFor(() => expect(getByText("Films:")).toBeInTheDocument());
  await myWaitFor(() => expect(getByText("Luke Skyguy")).toBeInTheDocument());
});

test("Nested overrides", async () => {
  const { getByText } = render(
    // LEVEL 1
    <SwapiOverride.Override
      with={(swapi) => {
        return {
          ...swapi,
          getFilms: async () => [],
          getPeople: async () => [
            {
              name: "Luke Skyguy",
              url: "1",
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
  await myWaitFor(() => expect(getByText("Films:")).toBeInTheDocument());
  await myWaitFor(() => expect(getByText("LUKE SKYGUY!!")).toBeInTheDocument());
});
