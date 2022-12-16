import React from "react";
import { PeopleList } from "./PeopleList";
import { Films } from "./Films";
import { LoadablePerson } from "./LoadablePerson";
import { createOverride } from "react-override";

(window as any).overridden = React.useState;
const useState = createOverride(() => (window as any).overridden);
const UseState = useState.createRef();

(window as any).UseState = UseState;


function App() {
  const [count, setCount] = useState.useValue()()(0);
  const [count2, setCount2] = React.useState(0)
  return (
    <>
    {count}
    <button onClick={() => setCount(count+1)}>Inc</button>
    {count2}
    <button onClick={() => setCount2(count2+1)}>Inc</button>
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

function App2 () {
  return <UseState><App /></UseState>
}

export default App2;
