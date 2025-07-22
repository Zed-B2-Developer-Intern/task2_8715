use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4000/api/questions").then(res => setQuestions(res.data));
  }, []);

  const handleSelect = (option: string) => {
    setSelected(option);
    const correct = option === questions[current].answer;
    if (correct) setScore(score + 1);
    setAnswers([...answers, { id: questions[current].id, selected: option, correct }]);
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setFinished(true);
        axios.post("http://localhost:4000/api/submit", {
          name: "User",
          answers,
          score: correct ? score + 1 : score
        });
      }
    }, 500);
  };

  if (questions.length === 0) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-[500px] mx-auto mt-10">
      {!finished ? (
        <>
          <h1 className="text-lg font-semibold mb-4">Question {current + 1} / {questions.length}</h1>
          <p className="mb-4">{questions[current].question}</p>
          {questions[current].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
              className={`block w-full text-left py-2 px-4 my-2 rounded 
                ${selected === opt ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}
              `}
            >
              {opt}
            </button>
          ))}
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Quiz Complete 🎉</h2>
          <p className="mt-4 text-xl">Score: {score} / {questions.length}</p>
          <p>Accuracy: {(score / questions.length * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
