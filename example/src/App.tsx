import React from "react";
import { PeopleList } from "./PeopleList";
import { Films } from "./Films";
import { LoadablePerson } from "./LoadablePerson";

function App() {
  return (
    <>
      <div>
        <LoadablePerson />
      </div>
      <div>
        <Films />
      </div>
      <div>
        <PeopleList />
      </div>
    </>
  );
}

export default App;
