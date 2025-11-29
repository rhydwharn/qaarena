import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft, GraduationCap, User, Mail, Phone, Calendar, BookOpen, CheckCircle, Users, Award } from 'lucide-react';

export default function SchoolManagementSimulator() {
  const [activeView, setActiveView] = useState('dashboard');
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@school.com', grade: 'A', course: 'Computer Science', attendance: 95 },
    { id: 2, name: 'Bob Smith', email: 'bob@school.com', grade: 'B+', course: 'Mathematics', attendance: 88 },
    { id: 3, name: 'Carol White', email: 'carol@school.com', grade: 'A-', course: 'Physics', attendance: 92 }
  ]);
  const [courses, setCourses] = useState([
    { id: 1, name: 'Computer Science', instructor: 'Dr. Smith', students: 25, duration: '12 weeks' },
    { id: 2, name: 'Mathematics', instructor: 'Prof. Johnson', students: 30, duration: '10 weeks' },
    { id: 3, name: 'Physics', instructor: 'Dr. Brown', students: 20, duration: '14 weeks' },
    { id: 4, name: 'Chemistry', instructor: 'Prof. Davis', students: 22, duration: '12 weeks' }
  ]);
  const [enrollmentForm, setEnrollmentForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    course: '',
    emergencyContact: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleEnrollmentChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEnrollmentSubmit = (e) => {
    e.preventDefault();
    const newStudent = {
      id: students.length + 1,
      name: `${enrollmentForm.firstName} ${enrollmentForm.lastName}`,
      email: enrollmentForm.email,
      grade: 'Pending',
      course: enrollmentForm.course,
      attendance: 0
    };
    setStudents([...students, newStudent]);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveView('students');
      setEnrollmentForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        course: '',
        emergencyContact: ''
      });
    }, 2000);
  };

  const stats = [
    { icon: <Users className="h-6 w-6 text-blue-500" />, label: 'Total Students', value: students.length, color: 'bg-blue-50' },
    { icon: <BookOpen className="h-6 w-6 text-green-500" />, label: 'Active Courses', value: courses.length, color: 'bg-green-50' },
    { icon: <Award className="h-6 w-6 text-purple-500" />, label: 'Avg Attendance', value: '92%', color: 'bg-purple-50' },
    { icon: <GraduationCap className="h-6 w-6 text-orange-500" />, label: 'Graduates', value: '156', color: 'bg-orange-50' }
  ];

  return (
    <div className="min-h-screen bg-gray-50" data-cy="school-simulator-page">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" data-cy="school-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/arena/dashboard" data-cy="school-back-button">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" data-cy="school-title">
                  EduTrack - School Management System
                </h1>
                <p className="text-sm text-gray-500" data-cy="school-subtitle">
                  Practice testing student enrollment and course management
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4" data-cy="school-nav-tabs">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
              data-cy="school-nav-dashboard"
            >
              Dashboard
            </Button>
            <Button
              variant={activeView === 'enroll' ? 'default' : 'outline'}
              onClick={() => setActiveView('enroll')}
              data-cy="school-nav-enroll"
            >
              Enroll Student
            </Button>
            <Button
              variant={activeView === 'students' ? 'default' : 'outline'}
              onClick={() => setActiveView('students')}
              data-cy="school-nav-students"
            >
              Students
            </Button>
            <Button
              variant={activeView === 'courses' ? 'default' : 'outline'}
              onClick={() => setActiveView('courses')}
              data-cy="school-nav-courses"
            >
              Courses
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div data-cy="school-dashboard-view">
            <h2 className="text-2xl font-bold mb-6" data-cy="school-dashboard-title">School Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-cy="school-stats-grid">
              {stats.map((stat, index) => (
                <Card key={index} className="border-2" data-cy={`school-stat-${index}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1" data-cy={`school-stat-label-${index}`}>
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-900" data-cy={`school-stat-value-${index}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 ${stat.color} rounded-lg`} data-cy={`school-stat-icon-${index}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Students */}
            <Card data-cy="school-recent-students">
              <CardHeader>
                <CardTitle data-cy="school-recent-title">Recent Enrollments</CardTitle>
                <CardDescription data-cy="school-recent-description">
                  Latest students enrolled in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.slice(-3).reverse().map(student => (
                    <div 
                      key={student.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      data-cy={`school-recent-student-${student.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold" data-cy={`school-recent-student-name-${student.id}`}>
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-600" data-cy={`school-recent-student-course-${student.id}`}>
                            {student.course}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600" data-cy={`school-recent-student-grade-${student.id}`}>
                          {student.grade}
                        </p>
                        <p className="text-sm text-gray-600" data-cy={`school-recent-student-attendance-${student.id}`}>
                          {student.attendance}% attendance
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enrollment Form View */}
        {activeView === 'enroll' && (
          <div data-cy="school-enroll-view">
            <h2 className="text-2xl font-bold mb-6" data-cy="school-enroll-title">Student Enrollment</h2>
            
            {showSuccess ? (
              <Card className="max-w-2xl mx-auto" data-cy="school-enroll-success">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-600 mb-2" data-cy="school-success-title">
                    Enrollment Successful!
                  </h3>
                  <p className="text-gray-600" data-cy="school-success-message">
                    Student has been enrolled successfully
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="max-w-2xl mx-auto" data-cy="school-enroll-form-card">
                <CardHeader>
                  <CardTitle data-cy="school-form-title">New Student Registration</CardTitle>
                  <CardDescription data-cy="school-form-description">
                    Fill in the student details to complete enrollment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEnrollmentSubmit} data-cy="school-enroll-form">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div data-cy="school-firstname-field">
                        <Label htmlFor="firstName" data-cy="school-firstname-label">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={enrollmentForm.firstName}
                          onChange={handleEnrollmentChange}
                          placeholder="John"
                          required
                          data-cy="school-firstname-input"
                        />
                      </div>

                      {/* Last Name */}
                      <div data-cy="school-lastname-field">
                        <Label htmlFor="lastName" data-cy="school-lastname-label">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={enrollmentForm.lastName}
                          onChange={handleEnrollmentChange}
                          placeholder="Doe"
                          required
                          data-cy="school-lastname-input"
                        />
                      </div>

                      {/* Email */}
                      <div data-cy="school-email-field">
                        <Label htmlFor="email" data-cy="school-email-label">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={enrollmentForm.email}
                          onChange={handleEnrollmentChange}
                          placeholder="john.doe@example.com"
                          required
                          data-cy="school-email-input"
                        />
                      </div>

                      {/* Phone */}
                      <div data-cy="school-phone-field">
                        <Label htmlFor="phone" data-cy="school-phone-label">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={enrollmentForm.phone}
                          onChange={handleEnrollmentChange}
                          placeholder="+1 234 567 8900"
                          required
                          data-cy="school-phone-input"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div data-cy="school-dob-field">
                        <Label htmlFor="dateOfBirth" data-cy="school-dob-label">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={enrollmentForm.dateOfBirth}
                          onChange={handleEnrollmentChange}
                          required
                          data-cy="school-dob-input"
                        />
                      </div>

                      {/* Course Selection */}
                      <div data-cy="school-course-field">
                        <Label htmlFor="course" data-cy="school-course-label">Select Course</Label>
                        <select
                          id="course"
                          name="course"
                          value={enrollmentForm.course}
                          onChange={handleEnrollmentChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          data-cy="school-course-select"
                        >
                          <option value="">Choose a course</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.name} data-cy={`school-course-option-${course.id}`}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Emergency Contact */}
                      <div className="md:col-span-2" data-cy="school-emergency-field">
                        <Label htmlFor="emergencyContact" data-cy="school-emergency-label">
                          Emergency Contact
                        </Label>
                        <Input
                          id="emergencyContact"
                          name="emergencyContact"
                          value={enrollmentForm.emergencyContact}
                          onChange={handleEnrollmentChange}
                          placeholder="Parent/Guardian phone number"
                          required
                          data-cy="school-emergency-input"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <Button type="submit" className="flex-1" data-cy="school-enroll-submit">
                        Enroll Student
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveView('dashboard')}
                        data-cy="school-enroll-cancel"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Students List View */}
        {activeView === 'students' && (
          <div data-cy="school-students-view">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" data-cy="school-students-title">All Students</h2>
              <Button onClick={() => setActiveView('enroll')} data-cy="school-add-student-button">
                Add New Student
              </Button>
            </div>

            <div className="grid gap-4" data-cy="school-students-grid">
              {students.map(student => (
                <Card 
                  key={student.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                  data-cy={`school-student-card-${student.id}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold" data-cy={`school-student-name-${student.id}`}>
                            {student.name}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2" data-cy={`school-student-email-${student.id}`}>
                            <Mail className="h-4 w-4" />
                            {student.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1" data-cy={`school-student-course-${student.id}`}>
                            <BookOpen className="h-4 w-4" />
                            {student.course}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">Grade</p>
                          <p className="text-xl font-bold text-green-600" data-cy={`school-student-grade-${student.id}`}>
                            {student.grade}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Attendance</p>
                          <p className="text-lg font-semibold" data-cy={`school-student-attendance-${student.id}`}>
                            {student.attendance}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Courses View */}
        {activeView === 'courses' && (
          <div data-cy="school-courses-view">
            <h2 className="text-2xl font-bold mb-6" data-cy="school-courses-title">Available Courses</h2>
            
            <div className="grid md:grid-cols-2 gap-6" data-cy="school-courses-grid">
              {courses.map(course => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow" data-cy={`school-course-card-${course.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl" data-cy={`school-course-name-${course.id}`}>
                          {course.name}
                        </CardTitle>
                        <CardDescription className="mt-2" data-cy={`school-course-instructor-${course.id}`}>
                          Instructor: {course.instructor}
                        </CardDescription>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Students Enrolled</p>
                        <p className="text-2xl font-bold" data-cy={`school-course-students-${course.id}`}>
                          {course.students}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="text-lg font-semibold" data-cy={`school-course-duration-${course.id}`}>
                          {course.duration}
                        </p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" data-cy={`school-course-register-${course.id}`}>
                      Register for Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
