import React from "react";
import { PeopleList } from "./PeopleList";
import { Films } from "./Films";

function App() {
  return (
    <>
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
