import React from "react";
import { useAsync } from "react-use";
import { SwapiOverride } from "./swapi";

export const Person: React.FunctionComponent<{ id: string }> = (props) => {
  const swapi = SwapiOverride.useValue();
  const person = useAsync(() => swapi.getPerson(props.id));
  return (
    <>
      {person.loading ? (
        <>Loading person...</>
      ) : person.error ? (
        <>Error loading person</>
      ) : (
        <>
          <span>Person:</span>
          <span>
            {person.value?.name} from {person.value?.planet}
          </span>
        </>
      )}
    </>
  );
};
