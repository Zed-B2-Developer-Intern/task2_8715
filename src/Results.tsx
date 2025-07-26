import { useEffect, useState } from 'react';
import axios from 'axios';

function Results() {
  const [scores, setScores] = useState<{ [user: string]: number }>({});

  useEffect(() => {
    axios.get('http://localhost:4000/api/results').then((res) => {
      setScores(res.data);
    });
  }, []);

  return (
    <div>
      <h2>All Results</h2>
      <ul>
        {Object.entries(scores).map(([user, score]) => (
          <li key={user}>{user}: {score}</li>
        ))}
      </ul>
    </div>
  );
}

export default Results;
