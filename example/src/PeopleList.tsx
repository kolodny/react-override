import React from "react";
import { useAsync } from "react-use";
import { Person } from "./Person";
import { SwapiOverride } from "./swapi";

export const PeopleList: React.FunctionComponent = () => {
  const swapi = SwapiOverride.useValue();
  const people = useAsync(() => swapi.getPeople());
  return (
    <>
      {people.loading ? (
        <>Loading people...</>
      ) : people.error ? (
        <>Error loading people</>
      ) : (
        <>
          <span>People:</span>
          <ul>
            {people.value?.map((r) => (
              <li key={r.url}>
                <div>{r.name}</div>
                <div>
                  More info: <Person id={r.id} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
