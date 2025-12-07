import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { adminAPI, questionsAPI } from '../services/api';
import { Users, FileQuestion, Shield, TrendingUp, AlertTriangle, Plus, Edit, Trash2, X, CheckSquare, Square } from 'lucide-react';
import { getCategories } from '../services/categoryService';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    type: 'single-choice',
    options: ['', '', '', ''],
    correctAnswers: [],
    explanation: '',
    category: '',
    difficulty: 'foundation',
    tags: '',
  });

  useEffect(() => {
    loadAdminData();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    if (activeTab === 'manage-questions') {
      loadAllQuestions();
    }
  }, [activeTab]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, flaggedRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getFlaggedQuestions(),
      ]);

      const apiStats = statsRes.data.data || {};
      setStats({
        totalUsers: apiStats.users?.total ?? 0,
        activeUsers: apiStats.users?.active ?? 0,
        totalQuestions: apiStats.questions?.total ?? 0,
        publishedQuestions: apiStats.questions?.published ?? 0,
        totalQuizzes: apiStats.quizzes?.total ?? 0,
        completedQuizzes: apiStats.quizzes?.completed ?? 0,
      });
      setUsers(usersRes.data.data.users || []);
      setFlaggedQuestions(flaggedRes.data.data.questions || []);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllQuestions = async () => {
    try {
      const response = await questionsAPI.getAll({ limit: 100 });
      const questions = response.data.data.questions || [];
      console.log('Loaded questions:', questions.slice(0, 2)); // Debug: check structure
      setAllQuestions(questions);
    } catch (error) {
      console.error('Failed to load questions:', error);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      await adminAPI.updateUserRole(userId, newRole);
      alert('User role updated successfully');
      loadAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return;

    try {
      await adminAPI.deactivateUser(userId);
      alert('User deactivated successfully');
      loadAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const handleReviewQuestion = async (questionId, status) => {
    try {
      await adminAPI.reviewQuestion(questionId, status);
      alert(`Question ${status} successfully`);
      loadAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to review question');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const toggleCorrectAnswer = (index) => {
    const { correctAnswers, type } = questionForm;
    let newCorrectAnswers;

    if (type === 'single-choice' || type === 'true-false') {
      newCorrectAnswers = [index];
    } else {
      newCorrectAnswers = correctAnswers.includes(index)
        ? correctAnswers.filter(i => i !== index)
        : [...correctAnswers, index];
    }

    setQuestionForm({ ...questionForm, correctAnswers: newCorrectAnswers });
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!questionForm.questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (questionForm.correctAnswers.length === 0) {
      alert('Please select at least one correct answer');
      return;
    }

    const questionData = {
      questionText: { en: questionForm.questionText },
      type: questionForm.type,
      options: questionForm.options
        .filter(opt => opt.trim())
        .map((text, idx) => ({
          text: { en: text },
          isCorrect: questionForm.correctAnswers.includes(idx),
        })),
      explanation: { en: questionForm.explanation },
      category: questionForm.category,
      difficulty: questionForm.difficulty,
      tags: questionForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'published',
    };

    try {
      if (editingQuestion) {
        await questionsAPI.update(editingQuestion.id || editingQuestion._id, questionData);
        alert('Question updated successfully!');
      } else {
        await questionsAPI.create(questionData);
        alert('Question created successfully!');
      }
      
      resetQuestionForm();
      loadAllQuestions();
      loadAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save question');
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionForm({
      questionText: question.questionText?.en || question.questionText || '',
      type: question.type,
      options: question.options.map(opt => opt.text?.en || opt.text || ''),
      correctAnswers: question.options
        .map((opt, idx) => (opt.isCorrect ? idx : null))
        .filter(idx => idx !== null),
      explanation: question.explanation?.en || question.explanation || '',
      category: question.category,
      difficulty: question.difficulty,
      tags: question.tags?.join(', ') || '',
    });
    setShowQuestionForm(true);
    setActiveTab('manage-questions');
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;

    try {
      await questionsAPI.delete(questionId);
      alert('Question deleted successfully');
      loadAllQuestions();
      loadAdminData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete question');
    }
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      questionText: '',
      type: 'single-choice',
      options: ['', '', '', ''],
      correctAnswers: [],
      explanation: '',
      category: '',
      difficulty: 'foundation',
      tags: '',
    });
    setEditingQuestion(null);
    setShowQuestionForm(false);
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedQuestions.length === allQuestions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(allQuestions.map(q => q.id || q._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedQuestions.length === 0) {
      alert('Please select questions to delete');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedQuestions.length} question(s)? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      const deletePromises = selectedQuestions.map(id => questionsAPI.delete(id));
      await Promise.all(deletePromises);
      
      alert(`Successfully deleted ${selectedQuestions.length} question(s)`);
      setSelectedQuestions([]);
      loadAllQuestions();
      loadAdminData();
    } catch (error) {
      console.error('Failed to delete questions:', error);
      alert(error.response?.data?.message || 'Failed to delete some questions');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-cy="admin-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl" data-cy="admin-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" data-cy="admin-title">
          <Shield className="h-8 w-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Manage users, questions, and platform settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto pb-2" data-cy="admin-tabs">
        <Button variant={activeTab === 'overview' ? 'default' : 'ghost'} onClick={() => setActiveTab('overview')} data-cy="admin-tab-overview">
          Overview
        </Button>
        <Button variant={activeTab === 'users' ? 'default' : 'ghost'} onClick={() => setActiveTab('users')} data-cy="admin-tab-users">
          Users ({users.length})
        </Button>
        <Button variant={activeTab === 'manage-questions' ? 'default' : 'ghost'} onClick={() => setActiveTab('manage-questions')} data-cy="admin-tab-questions">
          Manage Questions ({allQuestions.length})
        </Button>
        <Button variant={activeTab === 'flagged' ? 'default' : 'ghost'} onClick={() => setActiveTab('flagged')} data-cy="admin-tab-flagged">
          Flagged ({flaggedQuestions.length})
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Active: {stats?.activeUsers || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <FileQuestion className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalQuestions || 0}</div>
              <p className="text-xs text-muted-foreground">Published: {stats?.publishedQuestions || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalQuizzes || 0}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Questions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{flaggedQuestions.length}</div>
              <p className="text-xs text-muted-foreground">Needs review</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user roles and access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'}`}>
                        {user.role}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select className="text-sm border rounded px-2 py-1" value={user.role} onChange={(e) => handleRoleUpdate(user._id, e.target.value)}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {user.isActive && (
                      <Button variant="destructive" size="sm" onClick={() => handleDeactivateUser(user._id)}>
                        Deactivate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manage Questions Tab */}
      {activeTab === 'manage-questions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Manage Questions</h2>
              <p className="text-muted-foreground">
                Create, edit, and delete questions
                {selectedQuestions.length > 0 && (
                  <span className="ml-2 font-medium text-primary">
                    ({selectedQuestions.length} selected)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {allQuestions.length > 0 && !showQuestionForm && (
                <>
                  <Button
                    onClick={toggleSelectAll}
                    variant="outline"
                    size="sm"
                    data-cy="admin-select-all-button"
                  >
                    {selectedQuestions.length === allQuestions.length ? (
                      <>
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="mr-2 h-4 w-4" />
                        Select All
                      </>
                    )}
                  </Button>
                  {selectedQuestions.length > 0 && (
                    <Button
                      onClick={handleDeleteSelected}
                      variant="destructive"
                      size="sm"
                      disabled={deleting}
                      data-cy="admin-delete-selected-button"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deleting ? 'Deleting...' : `Delete ${selectedQuestions.length}`}
                    </Button>
                  )}
                </>
              )}
              <Button onClick={() => setShowQuestionForm(!showQuestionForm)} data-cy="admin-add-question-button">
                {showQuestionForm ? (
                  <><X className="mr-2 h-4 w-4" /> Cancel</>
                ) : (
                  <><Plus className="mr-2 h-4 w-4" /> Add Question</>
                )}
              </Button>
            </div>
          </div>

          {/* Question Form */}
          {showQuestionForm && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question Text *</Label>
                    <textarea
                      id="questionText"
                      className="w-full min-h-[100px] p-3 border rounded-md"
                      value={questionForm.questionText}
                      onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                      placeholder="Enter your question here..."
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="type">Question Type *</Label>
                      <select
                        id="type"
                        className="w-full h-10 px-3 border rounded-md"
                        value={questionForm.type}
                        onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value, correctAnswers: [] })}
                      >
                        <option value="single-choice">Single Choice</option>
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={questionForm.category}
                        onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                        placeholder="Enter category (e.g., fundamentals, javascript, security)"
                        list="category-suggestions"
                        required
                      />
                      <datalist id="category-suggestions">
                        {categories.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                      <p className="text-xs text-muted-foreground">Type any category or select from existing ones</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty *</Label>
                      <select
                        id="difficulty"
                        className="w-full h-10 px-3 border rounded-md"
                        value={questionForm.difficulty}
                        onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                      >
                        <option value="foundation">Foundation</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Answer Options * (Check correct answers)</Label>
                    {questionForm.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type={questionForm.type === 'multiple-choice' ? 'checkbox' : 'radio'}
                          checked={questionForm.correctAnswers.includes(idx)}
                          onChange={() => toggleCorrectAnswer(idx)}
                          className="w-4 h-4"
                        />
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          required={idx < 2}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation</Label>
                    <textarea
                      id="explanation"
                      className="w-full min-h-[80px] p-3 border rounded-md"
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                      placeholder="Explain the correct answer..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={questionForm.tags}
                      onChange={(e) => setQuestionForm({ ...questionForm, tags: e.target.value })}
                      placeholder="e.g., istqb, basics, theory"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingQuestion ? 'Update Question' : 'Create Question'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetQuestionForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            {allQuestions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileQuestion className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No questions yet. Create your first question!</p>
                </CardContent>
              </Card>
            ) : (
              allQuestions.map((question) => (
                <Card
                  key={question.id || question._id}
                  className={`${
                    selectedQuestions.includes(question.id || question._id) ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(question.id || question._id)}
                          onChange={() => toggleQuestionSelection(question.id || question._id)}
                          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {question.questionText?.en || question.questionText}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
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
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditQuestion(question)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteQuestion(question.id || question._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <Card>
          <CardHeader>
            <CardTitle>Question Categories</CardTitle>
            <CardDescription>ISTQB Foundation Level Categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { value: 'fundamentals', label: 'Fundamentals of Testing', description: 'Basic testing concepts and terminology' },
                { value: 'testing-throughout-sdlc', label: 'Testing Throughout SDLC', description: 'Testing in different lifecycle models' },
                { value: 'static-testing', label: 'Static Testing', description: 'Reviews and static analysis' },
                { value: 'test-techniques', label: 'Test Techniques', description: 'Black-box, white-box, and experience-based techniques' },
                { value: 'test-management', label: 'Test Management', description: 'Test planning, monitoring, and control' },
                { value: 'tool-support', label: 'Tool Support for Testing', description: 'Test tools and automation' },
              ].map((cat) => (
                <div key={cat.value} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{cat.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {cat.value}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {allQuestions.filter(q => q.category === cat.value).length}
                      </p>
                      <p className="text-xs text-muted-foreground">questions</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-sm text-teal-900">
                <strong>Note:</strong> Categories are based on ISTQB Foundation Level syllabus. To modify categories, update the Question model enum in the backend.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flagged Questions Tab */}
      {activeTab === 'flagged' && (
        <Card>
          <CardHeader>
            <CardTitle>Flagged Questions</CardTitle>
            <CardDescription>Review flagged content</CardDescription>
          </CardHeader>
          <CardContent>
            {flaggedQuestions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No flagged questions</p>
            ) : (
              <div className="space-y-4">
                {flaggedQuestions.map((q) => (
                  <div key={q._id} className="border rounded p-4">
                    <p className="font-medium">{q.questionText?.en || q.questionText}</p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => handleReviewQuestion(q._id, 'published')}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReviewQuestion(q._id, 'archived')}>Archive</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
