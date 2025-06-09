import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();


function App() {
  const [Tickers, setTickers] = useState<Array<Schema["Ticker"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    const subscription = client.models.Ticker.observeQuery().subscribe({
      next: (data) => setTickers([...data.items]),
    });
    return () => subscription.unsubscribe();
  }, []);

  function createTicker() {
    const content = window.prompt("Enter Stock Ticker Symbol:");
    if (!content) return;

    const freqInput = window.prompt("Enter Frequency in Hours (e.g., 1.00):");
    const frequency = parseFloat(freqInput || "");
    if (isNaN(frequency) || frequency <= 0) {
      alert("Invalid frequency. Please enter a positive number.");
      return;
    }

    client.models.Ticker.create({ content: content.toUpperCase(), frequency });
  }

  function deleteTicker(id: string) {
    client.models.Ticker.delete({ id })
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Tickers</h1>
      <button onClick={createTicker}>Enter Stock Ticker</button>
      <ul>
        {Tickers.map((Ticker) => (
          <li onClick={() => deleteTicker(Ticker.id)} key={Ticker.id}>
            {Ticker.content} — every {Ticker.frequency}h
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new Ticker.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}


export default App;
