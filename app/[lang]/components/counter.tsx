"use client";

import { useState } from "react";
import { getDictionary } from "../../../dictionaries/get-dictionary";

type Dict = Awaited<ReturnType<typeof getDictionary>>;
type CounterDict = Dict extends { counter: infer C }
  ? C
  : { increment: string; decrement: string }; // fallback minimal

export default function Counter({ dictionary }: { dictionary: CounterDict }) {
  const [count, setCount] = useState(0);
  return (
    <p>
      This component is rendered on client:
      <button onClick={() => setCount((n) => n - 1)}>{dictionary.decrement}</button>
      {count}
      <button onClick={() => setCount((n) => n + 1)}>{dictionary.increment}</button>
    </p>
  );
}
