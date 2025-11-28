import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { quizAPI, questionsAPI } from '../services/api';
import { CheckCircle, XCircle, Clock, Award, ArrowRight, Home } from 'lucide-react';

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Helpers to derive selected indices and correctness (robust to backend field names)
  const deriveSelected = (q) => {
    let selected = q.selectedOptions;
    if (!Array.isArray(selected)) {
      if (typeof q.userAnswerIndex === 'number') selected = [q.userAnswerIndex];
      else if (Array.isArray(q.userAnswerIndices)) selected = q.userAnswerIndices;
      else if (Array.isArray(q.userSelected)) selected = q.userSelected;
      else if (Array.isArray(q.answer)) selected = q.answer;
      else if (typeof q.userAnswer === 'number') selected = [q.userAnswer];
      else selected = [];
    }
    // Fallback to local state captured during the session if backend doesn't echo selection
    if ((!selected || selected.length === 0) && q?.question?._id) {
      const local = selectedAnswers[q.question._id];
      if (Array.isArray(local)) return local;
    }
    return selected || [];
  };

  const isSelectionCorrect = (q, selected) => {
    const correct = (q.question.options || []).reduce((acc, opt, idx) => {
      if (opt.isCorrect) acc.push(idx);
      return acc;
    }, []);
    if (correct.length !== selected.length) return false;
    const setA = new Set(correct);
    for (const i of selected) if (!setA.has(i)) return false;
    return true;
  };

  // New-quiz selector state
  const [selCategory, setSelCategory] = useState('');
  const [allCats, setAllCats] = useState(false);
  const [maxAvail, setMaxAvail] = useState(null);
  const [selCount, setSelCount] = useState(10);

  useEffect(() => {
    if (id) {
      loadQuiz();
    } else {
      setLoading(false);
      setQuiz(null);
    }
  }, [id]);

  // Fetch max available for selector
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const params = allCats || !selCategory ? { limit: 1, page: 1 } : { category: selCategory, limit: 1, page: 1 };
        const res = await questionsAPI.getAll(params);
        const total = res?.data?.data?.total ?? null;
        setMaxAvail(total);
        if (total && selCount > total) setSelCount(total);
      } catch (e) {
        console.error('Failed to compute available questions:', e);
        setMaxAvail(null);
      }
    };
    fetchCount();
  }, [selCategory, allCats]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getById(id);
      const loadedQuiz = response.data.data.quiz;
      
      console.log('Loading quiz:', {
        id: loadedQuiz._id,
        status: loadedQuiz.status,
        totalQuestions: loadedQuiz.questions.length,
        questionsWithAnswers: loadedQuiz.questions.filter(q => q.userAnswer !== undefined && q.userAnswer !== null).length
      });
      
      setQuiz(loadedQuiz);
      
      // Check if quiz is already completed
      if (loadedQuiz.status === 'completed') {
        setSubmitted(true);
        calculateResults(loadedQuiz);
      } else {
        // Resume quiz - restore progress
        restoreQuizProgress(loadedQuiz);
      }
    } catch (error) {
      console.error('Failed to load quiz:', error);
      alert('Failed to load quiz. Redirecting to dashboard...');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const restoreQuizProgress = (loadedQuiz) => {
    // Find the first unanswered question and restore all previous answers
    let firstUnansweredIndex = loadedQuiz.questions.length; // Default to end if all answered
    const restoredAnswers = {};

    for (let i = 0; i < loadedQuiz.questions.length; i++) {
      const q = loadedQuiz.questions[i];
      const questionId = q.question._id;
      
      // Check if question has been answered
      if (q.userAnswer !== undefined && q.userAnswer !== null && 
          (Array.isArray(q.userAnswer) ? q.userAnswer.length > 0 : true)) {
        // Store the previous answer
        restoredAnswers[questionId] = Array.isArray(q.userAnswer) ? q.userAnswer : [q.userAnswer];
      } else {
        // This is the first unanswered question
        if (firstUnansweredIndex === loadedQuiz.questions.length) {
          firstUnansweredIndex = i;
        }
      }
    }

    // If all questions are answered, go to last question
    if (firstUnansweredIndex === loadedQuiz.questions.length && loadedQuiz.questions.length > 0) {
      firstUnansweredIndex = loadedQuiz.questions.length - 1;
    }

    console.log('Restoring quiz progress:');
    console.log('- Total questions:', loadedQuiz.questions.length);
    console.log('- Answered questions:', Object.keys(restoredAnswers).length);
    console.log('- Resuming at index:', firstUnansweredIndex);
    console.log('- Restored answers:', restoredAnswers);

    // Restore state
    setCurrentQuestionIndex(firstUnansweredIndex);
    setSelectedAnswers(restoredAnswers);
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    if (submitted) return;
    
    const question = quiz.questions[currentQuestionIndex];
    
    if (question.question.type === 'multiple-choice') {
      // For multiple choice, toggle selection
      const current = selectedAnswers[questionId] || [];
      const newAnswers = current.includes(optionIndex)
        ? current.filter(i => i !== optionIndex)
        : [...current, optionIndex];
      setSelectedAnswers({ ...selectedAnswers, [questionId]: newAnswers });
    } else {
      // For single choice and true/false, replace selection
      setSelectedAnswers({ ...selectedAnswers, [questionId]: [optionIndex] });
    }
  };

  const handleSubmitAnswer = async () => {
    const question = quiz.questions[currentQuestionIndex];
    const answer = selectedAnswers[question.question._id];
    
    if (!answer || answer.length === 0) {
      alert('Please select an answer before continuing');
      return;
    }

    try {
      // Backend expects 'answer' field, can be array or single value
      const answerData = {
        quizId: id,
        questionId: question.question._id,
        answer: question.question.type === 'multiple-choice' ? answer : answer[0],
      };
      
      console.log('Submitting answer:', answerData);
      await quizAPI.answer(answerData);

      // Move to next question or finish
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered, complete quiz
        await handleCompleteQuiz();
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert(error.response?.data?.message || 'Failed to submit answer');
    }
  };

  const handleCompleteQuiz = async () => {
    try {
      setSubmitting(true);
      const response = await quizAPI.complete(id);
      setSubmitted(true);
      calculateResults(response.data.data.quiz);
    } catch (error) {
      console.error('Failed to complete quiz:', error);
      alert(error.response?.data?.message || 'Failed to complete quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const startNewQuiz = async () => {
    try {
      const max = Number(maxAvail) || 0;
      if (max === 0) {
        alert('No questions available for the selected criteria');
        return;
      }
      const requested = Number(selCount);
      const count = Math.max(1, Math.min(requested, max));
      const payload = {
        mode: 'practice',
        numberOfQuestions: count,
      };
      if (!allCats && selCategory) payload.category = selCategory;
      // keep beginner level by default
      payload.difficulty = 'foundation';

      const response = await quizAPI.start(payload);
      navigate(`/quiz/${response.data.data.quiz._id}`);
    } catch (error) {
      console.error('Failed to start new quiz:', error);
      alert(error.response?.data?.message || 'Failed to start quiz');
    }
  };

  const calculateResults = (completedQuiz) => {
    const totalQuestions = completedQuiz.questions.length;
    const correctAnswers = completedQuiz.questions.reduce((sum, q) => {
      const selected = deriveSelected(q);
      return sum + (isSelectionCorrect(q, selected) ? 1 : 0);
    }, 0);
    const score = (correctAnswers / totalQuestions) * 100;

    setResults({
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      score: score.toFixed(1),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-cy="quiz-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz && id) {
    return (
      <div className="container mx-auto p-6" data-cy="quiz-not-found">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Quiz not found</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4" data-cy="quiz-not-found-dashboard-button">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results View
  if (submitted && results) {
    return (
      <div className="container mx-auto p-6 max-w-4xl" data-cy="quiz-results-page">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {results.score >= 70 ? (
                <Award className="h-16 w-16 text-green-500 mx-auto" />
              ) : (
                <Clock className="h-16 w-16 text-orange-500 mx-auto" />
              )}
            </div>
            <CardTitle className="text-3xl" data-cy="quiz-results-title">Quiz Completed!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card data-cy="quiz-results-score-card">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-primary" data-cy="quiz-results-score">{results.score}%</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </CardContent>
              </Card>
              <Card data-cy="quiz-results-correct-card">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-green-600" data-cy="quiz-results-correct">{results.correctAnswers}</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </CardContent>
              </Card>
              <Card data-cy="quiz-results-incorrect-card">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-red-600">{results.incorrectAnswers}</p>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </CardContent>
              </Card>
            </div>

            {/* Review Answers */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Answers</h3>
              {quiz.questions.map((q, idx) => {
                const selected = deriveSelected(q);
                const correctNow = isSelectionCorrect(q, selected);

                return (
                  <Card key={q.question._id} className={correctNow ? 'border-green-200' : 'border-red-200'}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        {correctNow ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1" />
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            Question {idx + 1}: {q.question.questionText?.en || q.question.questionText}
                          </CardTitle>
                          {selected.length > 0 && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              You chose: {selected.map(i => String.fromCharCode(65 + i)).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {q.question.options?.map((option, optIdx) => {
                          const isSelected = selected.includes(optIdx);
                          const isCorrect = option.isCorrect;
                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-md border ${
                                isCorrect
                                  ? 'bg-green-50 border-green-300'
                                  : isSelected
                                  ? 'bg-red-50 border-red-300'
                                  : 'bg-background'
                              }`}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                              {option.text?.en || option.text}
                              {isCorrect && <span className="ml-2 text-green-600 font-medium">✓ Correct</span>}
                              {isSelected && (
                                <span className={`ml-2 font-medium ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                                  {isCorrect ? '✓ Your answer' : '✗ Your answer'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {q.question.explanation && (
                        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-md">
                          <p className="text-sm font-medium text-teal-900">Explanation:</p>
                          <p className="text-sm text-teal-800">
                            {q.question.explanation?.en || q.question.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button onClick={() => navigate('/questions')} className="flex-1">
                Take Another Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Taking View
  return (
    <div className="container mx-auto p-6 max-w-4xl" data-cy="quiz-page">
      {/* Start New Quiz Selector (only when no active quiz is loaded) */}
      {!quiz && (
        <Card className="mb-6" data-cy="start-new-quiz-card">
          <CardHeader>
            <CardTitle>Start a New Quiz</CardTitle>
            <CardDescription>Select category (or all) and number of questions</CardDescription>
          </CardHeader>
          <CardContent>
            {/* All categories callout */}
            <div className="mb-4 p-3 rounded-md border border-dashed bg-accent/20">
              <label className="flex items-start gap-3">
                <input
                  id="allcats"
                  type="checkbox"
                  className="mt-0.5 scale-110"
                  checked={allCats}
                  onChange={(e) => { setAllCats(e.target.checked); if (e.target.checked) setSelCategory(''); }}
                  data-cy="quiz-all-categories-checkbox"
                />
                <div>
                  <p className="font-medium">All categories</p>
                  <p className="text-xs text-muted-foreground">Enable to build a mixed quiz from every category. Leave unchecked to pick a specific category below.</p>
                </div>
              </label>
            </div>

            {/* Selector grid */}
            <div className="grid md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-1">
                <Label htmlFor="category" className="mb-1 block">Category</Label>
                <select
                  id="category"
                  className="w-full border rounded-md h-10 px-3 disabled:bg-muted"
                  value={selCategory}
                  onChange={(e) => setSelCategory(e.target.value)}
                  disabled={allCats}
                  data-cy="quiz-selector-category"
                >
                  <option value="" disabled>Select a category</option>
                  <option value="fundamentals">Fundamentals of Testing</option>
                  <option value="testing-throughout-sdlc">Testing Throughout the SDLC</option>
                  <option value="static-testing">Static Testing</option>
                  <option value="test-techniques">Test Design Techniques</option>
                  <option value="test-management">Test Management</option>
                  <option value="tool-support">Tool Support for Testing</option>
                  <option value="agile-testing">Agile Testing</option>
                  <option value="test-automation">Test Automation</option>
                </select>
                {maxAvail !== null && (
                  <p className="text-xs text-muted-foreground mt-1">Max available: {maxAvail}</p>
                )}
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="qnum" className="mb-1 block">Number of questions</Label>
                <Input
                  id="qnum"
                  type="number"
                  min={1}
                  max={Math.max(1, maxAvail || 1)}
                  value={selCount}
                  onChange={(e) => setSelCount(Number(e.target.value))}
                  data-cy="quiz-selector-count-input"
                />
              </div>
              <div className="md:col-span-1 flex md:justify-end">
                <Button className="mt-6 md:mt-0" onClick={startNewQuiz} disabled={(!allCats && !selCategory) || (maxAvail === 0)} data-cy="quiz-selector-start-button">
                  Start New Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {quiz && (
        <>

      {/* Progress Header */}
      <Card className="mb-6" data-cy="quiz-progress-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" data-cy="quiz-progress-text">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {quiz.category || 'Mixed'} • {quiz.difficulty || 'All Levels'}
            </span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / (quiz?.questions?.length || 1)) * 100} className="h-2" data-cy="quiz-progress-bar" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card data-cy="quiz-question-card">
        <CardHeader>
          <CardTitle className="text-xl" data-cy="quiz-question-text">
            {quiz.questions[currentQuestionIndex].question.questionText?.en || quiz.questions[currentQuestionIndex].question.questionText}
          </CardTitle>
          <CardDescription>
            {quiz.questions[currentQuestionIndex].question.type === 'multiple-choice'
              ? 'Select all that apply'
              : 'Select one answer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quiz.questions[currentQuestionIndex].question.options?.map((option, idx) => {
              const isSelected = (selectedAnswers[quiz.questions[currentQuestionIndex].question._id] || []).includes(idx);
              
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(quiz.questions[currentQuestionIndex].question._id, idx)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                  data-cy={`quiz-option-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-border'
                      }`}
                    >
                      {isSelected && '✓'}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {option.text?.en || option.text}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex-1"
              data-cy="quiz-previous-button"
            >
              Previous
            </Button>
            <Button
              onClick={handleSubmitAnswer}
              disabled={(selectedAnswers[quiz.questions[currentQuestionIndex].question._id] || []).length === 0 || submitting}
              className="flex-1"
              data-cy="quiz-submit-answer-button"
            >
              {submitting ? (
                'Submitting...'
              ) : currentQuestionIndex === quiz.questions.length - 1 ? (
                'Submit Quiz'
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}
