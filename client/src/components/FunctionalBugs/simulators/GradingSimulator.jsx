import React, { useState } from 'react';
import { GraduationCap, Calculator } from 'lucide-react';

const GradingSimulator = ({ bug, onBugFound, disabled }) => {
  const bugId = bug.bugId;

  // FB046: Grade Calculation Ignores Dropped Lowest Score
  if (bugId === 'FB046') {
    return <DroppedScoreScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  // FB052: Weighted Average Calculation Wrong
  if (bugId === 'FB052') {
    return <WeightedAverageScenario onBugFound={onBugFound} disabled={disabled} />;
  }

  return <div>Grading simulator for {bugId} coming soon...</div>;
};

// FB046: Grade Calculation Ignores Dropped Lowest Score
const DroppedScoreScenario = ({ onBugFound, disabled }) => {
  const quizScores = [85, 90, 75, 88, 92];
  const [calculated, setCalculated] = useState(false);
  const [displayedGrade, setDisplayedGrade] = useState(0);

  const handleCalculate = () => {
    if (disabled || calculated) return;

    // BUG: All scores counted, lowest not dropped
    const average = quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length;
    setDisplayedGrade(average);
    setCalculated(true);

    setTimeout(() => {
      if (onBugFound) onBugFound();
    }, 1000);
  };

  // Correct calculation (drop lowest)
  const sortedScores = [...quizScores].sort((a, b) => a - b);
  const scoresWithoutLowest = sortedScores.slice(1);
  const correctAverage = scoresWithoutLowest.reduce((sum, score) => sum + score, 0) / scoresWithoutLowest.length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <GraduationCap className="h-7 w-7" />
          Grade Calculator
        </h2>
        <p className="text-gray-600">
          Calculate final grade (Policy: Drop lowest quiz score)
        </p>
      </div>

      {/* Syllabus Policy */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Grading Policy:</h3>
        <p className="text-blue-800">
          "The lowest quiz score will be dropped from the final grade calculation"
        </p>
      </div>

      {/* Quiz Scores */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Quiz Scores:</h3>
        <div className="grid grid-cols-5 gap-2">
          {quizScores.map((score, idx) => (
            <div key={idx} className="text-center">
              <div className={`p-3 rounded-lg ${
                score === Math.min(...quizScores) 
                  ? 'bg-red-100 border-2 border-red-300' 
                  : 'bg-white border border-gray-300'
              }`}>
                <p className="text-sm text-gray-600">Quiz {idx + 1}</p>
                <p className="text-xl font-bold">{score}%</p>
              </div>
              {score === Math.min(...quizScores) && (
                <p className="text-xs text-red-600 mt-1">Lowest</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={disabled || calculated}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg mb-6"
      >
        {calculated ? 'Grade Calculated' : 'Calculate Final Grade'}
      </button>

      {calculated && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 mb-2">✓ Grade Calculated</p>
            <p className="text-3xl font-bold text-green-900">
              {displayedGrade.toFixed(2)}%
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              🤔 Manual calculation (dropping lowest {Math.min(...quizScores)}%):
              <br />
              ({scoresWithoutLowest.join(' + ')}) ÷ {scoresWithoutLowest.length} = {correctAverage.toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// FB052: Weighted Average Calculation Wrong
const WeightedAverageScenario = ({ onBugFound, disabled }) => {
  const examScore = 90;
  const homeworkScore = 80;
  const examWeight = 60;
  const homeworkWeight = 40;
  
  const [calculated, setCalculated] = useState(false);
  const [displayedGrade, setDisplayedGrade] = useState(0);

  const handleCalculate = () => {
    if (disabled || calculated) return;

    // BUG: Using simple average instead of weighted average
    const simpleAverage = (examScore + homeworkScore) / 2;
    setDisplayedGrade(simpleAverage);
    setCalculated(true);

    setTimeout(() => {
      if (onBugFound) onBugFound();
    }, 1000);
  };

  // Correct weighted average
  const correctGrade = (examScore * (examWeight / 100)) + (homeworkScore * (homeworkWeight / 100));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Calculator className="h-7 w-7" />
          Final Grade Calculator
        </h2>
        <p className="text-gray-600">
          Calculate weighted final grade
        </p>
      </div>

      {/* Course Weights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Course Weights:</h3>
        <div className="space-y-1 text-blue-800">
          <p>• Exams: {examWeight}%</p>
          <p>• Homework: {homeworkWeight}%</p>
        </div>
      </div>

      {/* Student Scores */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Student Scores:</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p className="text-sm text-gray-600">Exams ({examWeight}%)</p>
            <p className="text-3xl font-bold text-gray-900">{examScore}%</p>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p className="text-sm text-gray-600">Homework ({homeworkWeight}%)</p>
            <p className="text-3xl font-bold text-gray-900">{homeworkScore}%</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        disabled={disabled || calculated}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg mb-6"
      >
        {calculated ? 'Grade Calculated' : 'Calculate Final Grade'}
      </button>

      {calculated && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 mb-2">✓ Final Grade</p>
            <p className="text-3xl font-bold text-green-900">
              {displayedGrade.toFixed(2)}%
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              🤔 Manual weighted calculation:
              <br />
              ({examScore} × {examWeight/100}) + ({homeworkScore} × {homeworkWeight/100})
              <br />
              = {(examScore * (examWeight/100)).toFixed(1)} + {(homeworkScore * (homeworkWeight/100)).toFixed(1)}
              <br />
              = {correctGrade.toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradingSimulator;
