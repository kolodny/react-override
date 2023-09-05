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
interface PersonInfo {
    name: string;
    planet: string;
}
export declare class Swapi {
    baseUrl: string;
    getFilms: () => Promise<Film[]>;
    getPeople: () => Promise<Person[]>;
    getPerson: (id: string) => Promise<PersonInfo>;
}
export declare const SwapiOverride: import("react-override").Override<Swapi>;
export {};
//# sourceMappingURL=swapi.d.ts.map