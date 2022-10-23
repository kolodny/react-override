import React from 'react';
import { SwapiOverride } from './swapi';

export const LoadablePerson: React.FunctionComponent = () => {
  const swapi = SwapiOverride.useValue();
  const [loadedPersonName, setLoadedPersonName] = React.useState('');
  return (
    <>
      <button
        onClick={async () => {
          const person = await swapi.getPerson('1');
          setLoadedPersonName(person.name);
        }}
      >
        Click to load person
      </button>
      <div>Loaded person name: {loadedPersonName}</div>
    </>
  );
};
