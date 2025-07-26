import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [user, setUser] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/api/questions').then((res) => {
      setQuestions(res.data);
      setAnswers(Array(res.data.length).fill(''));
    });
  }, []);

  const submit = () => {
    if (!user) {
      alert('Please enter your name');
      return;
    }
    axios.post('http://localhost:4000/api/submit', { user, answers }).then((res) => {
      setResult(res.data);
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div>
        <h2>Quiz Result</h2>
        <p>
          {user}'s Score: {result.score} / {result.total}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Quiz App</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      {questions.map((q, i) => (
        <div key={q.id}>
          <p>{q.question}</p>
          {q.options.map((opt: string) => (
            <label key={opt}>
              <input
                type="radio"
                name={`q-${i}`}
                value={opt}
                checked={answers[i] === opt}
                onChange={() => {
                  const updated = [...answers];
                  updated[i] = opt;
                  setAnswers(updated);
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submit}>Submit Quiz</button>
    </div>
  );
}

export default App;

