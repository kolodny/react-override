import { createOverride } from "react-override";

export interface Film {
  title: string;
  url: string;
}

export interface Person {
  id: string;
  name: string;
  homeworld: string;
  url: string;
}

interface Response<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T;
}

interface PersonInfo {
  name: string;
  planet: string;
}

export class Swapi {
  baseUrl = "https://swapi.dev/api";
  getFilms = async (): Promise<Film[]> => {
    const response = await fetch(`${this.baseUrl}/films?format=json`);
    const json = (await response.json()) as Response<Film[]>;
    return json.results;
  };
  getPeople = async (): Promise<Person[]> => {
    const response = await fetch(`${this.baseUrl}/people?format=json`);
    const json = (await response.json()) as Response<Person[]>;
    return json.results.map((p: any) => ({
      ...p,
      id: p.url.match(/\d+(?=\/?$)/)[0],
    }));
  };
  getPerson = async (id: string): Promise<PersonInfo> => {
    const personResponse = await fetch(
      `${this.baseUrl}/people/${id}?format=json`
    );
    const person = (await personResponse.json()) as Person;
    const planetResponse = await fetch(`${person.homeworld}?format=json`);
    const planet = await planetResponse.json();
    return {
      name: person.name,
      planet: planet.name,
    };
  };
}

export const SwapiOverride = createOverride(new Swapi());
