import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

//Todo is the table that houses the Todos, column is content
function App() {
  const [tickers, setTickers] = useState<Array<Schema["StockAlertTable"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();
  useEffect(() => {
    client.models.StockAlertTable.observeQuery().subscribe({
      next: (data) => setTickers([...data.items]),
    });
  }, []);

  function createTicker() {
    client.models.StockAlertTable.create({ content: window.prompt("Add Ticker") });
  }

  function deleteTicker(id: string) {
    client.models.StockAlertTable.delete({ id })
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Tickers</h1>
      <button onClick={createTicker}>Enter Stock Ticker</button>
      <ul>
        {tickers.map((tickers) => (
          <li
          onClick={() => deleteTicker(tickers.id)}
          key={tickers.id}>{tickers.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try adding a new ticker.
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
