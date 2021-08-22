import React from "react";
import { useAsync } from "react-use";
import { SwapiOverride } from "./swapi";

export const Films: React.FunctionComponent = () => {
  const swapi = SwapiOverride.useValue();
  const films = useAsync(() => swapi.getFilms());
  return (
    <>
      {films.loading ? (
        <>Loading films...</>
      ) : films.error ? (
        <>Error loading films</>
      ) : (
        <>
          <span>Films:</span>
          <ul>
            {films.value?.map((r) => (
              <li key={r.url}>
                <div>{r.title}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
