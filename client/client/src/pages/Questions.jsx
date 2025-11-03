import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { questionsAPI, quizAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ThumbsUp, ThumbsDown, Flag, Search, Filter, PlayCircle, Edit } from 'lucide-react';

export default function Questions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
  });
  const [startingQuiz, setStartingQuiz] = useState(false);
  const [allCategories, setAllCategories] = useState(true);
  const [numQuestions, setNumQuestions] = useState(10);
  const [maxAvailable, setMaxAvailable] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  // compute max available for selected scope
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const params = allCategories || !filters.category ? { limit: 1, page: 1 } : { category: filters.category, limit: 1, page: 1 };
        const res = await questionsAPI.getAll(params);
        const total = res?.data?.data?.total ?? null;
        setMaxAvailable(total);
        if (total && numQuestions > total) setNumQuestions(total);
      } catch (e) {
        setMaxAvailable(null);
      }
    };
    fetchCount();
  }, [filters.category, allCategories]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadQuestions();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters.category, filters.difficulty]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadQuestions();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.search) params.search = filters.search;
      
      console.log('Fetching questions with params:', params);
      const response = await questionsAPI.getAll(params);
      console.log('Questions response:', response.data);
      
      const questionsList = response.data.data?.questions || [];
      setQuestions(questionsList);
      console.log('Loaded questions:', questionsList.length);
    } catch (err) {
      console.error('Failed to load questions:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (questionId, voteType) => {
    try {
      await questionsAPI.vote(questionId, voteType);
      loadQuestions();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleFlag = async (questionId) => {
    const reason = prompt('Please provide a reason for flagging this question:');
    if (!reason) return;

    try {
      await questionsAPI.flag(questionId, reason);
      alert('Question flagged successfully');
      loadQuestions();
    } catch (error) {
      console.error('Failed to flag question:', error);
      alert(error.response?.data?.message || 'Failed to flag question');
    }
  };

  const startQuiz = async () => {
    try {
      setStartingQuiz(true);
      const max = Number(maxAvailable) || 0;
      if (max === 0) {
        alert('No questions available for the selected criteria');
        setStartingQuiz(false);
        return;
      }
      const requested = Number(numQuestions);
      const count = Math.max(1, Math.min(requested, max));
      const quizData = {
        mode: 'practice',
        numberOfQuestions: count,
        difficulty: filters.difficulty || 'foundation',
      };
      if (!allCategories && filters.category) quizData.category = filters.category;
      const response = await quizAPI.start(quizData);
      navigate(`/quiz/${response.data.data.quiz._id}`);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      alert(error.response?.data?.message || 'Failed to start quiz');
      setStartingQuiz(false);
    }
  };

  const categories = [
    { value: 'fundamentals', label: 'Fundamentals of Testing' },
    { value: 'testing-throughout-sdlc', label: 'Testing Throughout the SDLC' },
    { value: 'static-testing', label: 'Static Testing' },
    { value: 'test-techniques', label: 'Test Design Techniques' },
    { value: 'test-management', label: 'Test Management' },
    { value: 'tool-support', label: 'Tool Support for Testing' },
    { value: 'agile-testing', label: 'Agile Testing' },
    { value: 'test-automation', label: 'Test Automation' },
  ];

  const difficulties = [
    { value: 'foundation', label: 'Foundation' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 font-medium mb-2">Error loading questions</p>
              <p className="text-sm text-red-500">{error}</p>
              <Button onClick={loadQuestions} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Question Bank</h1>
        <p className="text-muted-foreground">Browse and practice ISTQB questions</p>
      </div>

      {/* Start Quiz Section */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <Label htmlFor="scope" className="mb-1 block">Scope</Label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  id="scope"
                  type="checkbox"
                  checked={allCategories}
                  onChange={(e) => { setAllCategories(e.target.checked); if (e.target.checked) setMaxAvailable(null); }}
                />
                All categories
              </label>
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="catselect" className="mb-1 block">Category</Label>
              <select
                id="catselect"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                disabled={allCategories}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {maxAvailable !== null && (
                <p className="text-xs text-muted-foreground mt-1">Max available: {maxAvailable}</p>
              )}
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="qcount" className="mb-1 block">Number of questions</Label>
              <Input
                id="qcount"
                type="number"
                min={1}
                max={Math.max(1, maxAvailable || 1)}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Start a quiz with {allCategories || !filters.category ? 'mixed questions' : 'selected category'}
            </p>
            <Button onClick={startQuiz} size="lg" disabled={startingQuiz || (maxAvailable === 0)}>
              <PlayCircle className="mr-2 h-5 w-5" />
              {startingQuiz ? 'Starting...' : 'Start Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Browse Questions
          </CardTitle>
          <CardDescription>Filter questions by category and difficulty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search questions..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              >
                <option value="">All Levels</option>
                {difficulties.map((diff) => (
                  <option key={diff.value} value={diff.value}>
                    {diff.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on user role */}
      {user?.role === 'admin' ? (
        // Admin View - Show all questions for management
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {questions.length} questions. Go to Admin Dashboard to create/edit questions.
            </p>
            <Button onClick={() => navigate('/admin')} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Manage Questions
            </Button>
          </div>
          {questions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No questions found</p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question) => (
              <Card key={question._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {question.questionText?.en || question.questionText || 'No question text'}
                      </CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {question.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                          {question.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                          {question.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {question.options?.map((option, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-md border ${
                          option.isCorrect
                            ? 'bg-green-50 border-green-200'
                            : 'bg-background'
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {option.text?.en || option.text || 'No option text'}
                        {option.isCorrect && (
                          <span className="ml-2 text-xs text-green-600 font-medium">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-md">
                      <p className="text-sm font-medium text-teal-900 mb-1">💡 Explanation:</p>
                      <p className="text-sm text-teal-800">
                        {question.explanation?.en || question.explanation || 'No explanation'}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Answered {question.statistics?.timesAnswered || 0} times •{' '}
                      {question.statistics?.timesCorrect && question.statistics?.timesAnswered
                        ? Math.round(
                            (question.statistics.timesCorrect / question.statistics.timesAnswered) * 100
                          )
                        : 0}
                      % success rate
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        // Regular User View - Show info card only
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Ready to Test Your Knowledge?</h3>
              <p className="text-muted-foreground mb-6">
                We have {questions.length} questions available for practice.
                Click "Start Quiz" above to begin your learning journey!
              </p>
              <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">{questions.length}</p>
                  <p className="text-sm text-muted-foreground">Questions Available</p>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">6</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
                <div className="p-4 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-primary">3</p>
                  <p className="text-sm text-muted-foreground">Difficulty Levels</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

{/* Old question list - removed for regular users
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No questions found</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {question.questionText?.en || question.questionText || 'No question text'}
                    </CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {question.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {question.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                        {question.type}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {question.options?.map((option, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-md border bg-background hover:bg-accent transition-colors"
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                      {option.text?.en || option.text || 'No option text'}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-md">
                    <p className="text-sm font-medium text-teal-900 mb-1">💡 Explanation:</p>
                    <p className="text-sm text-teal-800">
                      {question.explanation?.en || question.explanation || 'No explanation'}
                    </p>
                  </div>
                )}

*/}
