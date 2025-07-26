import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const questions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Rome', 'Berlin'],
    answer: 'Paris',
  },
  {
    id: 2,
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    answer: '4',
  },
];

let scores: { [user: string]: number } = {};

app.get('/api/questions', (req, res) => {
  res.json(questions.map(({ answer, ...rest }) => rest));
});

app.post('/api/submit', (req, res) => {
  const { user, answers } = req.body;
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });
  scores[user] = score;
  res.json({ score, total: questions.length });
});

app.get('/api/results', (req, res) => {
  res.json(scores);
});

app.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});
