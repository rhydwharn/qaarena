import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from 'lucide-react';

export default function Events() {
  const upcomingEvents = [
    {
      title: 'Association of Nigeria Software Testers Conference',
      date: '2025-12-06',
      time: '9:00 AM - 2:00 PM',
      location: 'Mega 1 Event Center, Orchid Road',
      attendees: 100,
      description: 'Annual Conference',
      type: 'Conference',
      status: 'Open',
      organization: 'Association of Nigeria Software Testers'
    },
    {
      title: 'HerTech Africa x Korrekt Tech',
      date: '2025-11-01',
      time: '6:00 PM - 8:00 PM',
      location: 'Online',
      attendees: 120,
      description: 'Female Techies Introduction to Software Testing supporting SDG 5',
      type: 'Bootcamp',
      status: 'Ongoing'
    },
    // {
    //   title: 'ISTQB Certification Prep',
    //   date: '2025-01-25',
    //   time: '6:00 PM - 8:00 PM',
    //   location: 'Online (Google Meet)',
    //   attendees: 78,
    //   description: 'Comprehensive preparation session for ISTQB Foundation Level',
    //   type: 'Webinar',
    //   status: 'Open'
    // },
    // {
    //   title: 'QA Career Panel Discussion',
    //   date: '2025-02-01',
    //   time: '7:00 PM - 9:00 PM',
    //   location: 'Online',
    //   attendees: 200,
    //   description: 'Industry experts share insights on QA career growth and opportunities',
    //   type: 'Panel',
    //   status: 'Coming Soon'
    // }
  ];

  const pastEvents = [
    {
      title: 'Korrekt Tech x Ministry of Tertiary Education',
      date: '2025-10-25',
      attendees: 600,
      recording: true
    },
    // {
    //   title: 'Korrekt Tech x Ministry of Tertiary Education',
    //   date: '2024-12-10',
    //   attendees: 150,
    //   recording: true
    // }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            QA Events
          </h1>
          <div className="w-24"></div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Upcoming QA Events</h2>
          <p className="text-xl text-muted-foreground">
            Join our community events, workshops, and competitions
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {upcomingEvents.map((event, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    event.type === 'Workshop' ? 'bg-teal-100 text-teal-700' :
                    event.type === 'Competition' ? 'bg-red-100 text-red-700' :
                    event.type === 'Webinar' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {event.type}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    event.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{event.attendees} registered</span>
                </div>
                <Button className="w-full mt-4" disabled={event.status !== 'Open'}>
                  {event.status === 'Open' ? 'Register Now' : 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Past Events */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6">Past Events - Watch Recordings</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {pastEvents.map((event, idx) => (
              <Card key={idx} className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="text-base">{event.title}</CardTitle>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString()} • {event.attendees} attended
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Watch Recording
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
