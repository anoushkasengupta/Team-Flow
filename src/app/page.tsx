import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Rocket, Users, CheckCircle, CalendarCheck, ShieldCheck, ListTodo, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Team Collaboration',
    desc: 'Work together in real-time, assign tasks, and keep everyone in sync.',
    popup: 'Chat, comment, and collaborate instantly with your team.'
  },
  {
    icon: ListTodo,
    title: 'Task Management',
    desc: 'Create, update, and track tasks with powerful filters and search.',
    popup: 'Organize tasks by priority, status, and assignee.'
  },
  {
    icon: CalendarCheck,
    title: 'Due Dates & Reminders',
    desc: 'Never miss a deadline with smart reminders and overdue tracking.',
    popup: "Get notified before tasks are due and see what's overdue."
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    desc: 'Your data is safe and always available, with secure authentication.',
    popup: 'We use industry-standard encryption and 99.9% uptime.'
  },
];

const testimonials = [
  {
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'This app transformed how our team works. Super intuitive and reliable!'
  },
  {
    name: 'Priya Patel',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: 'I love the real-time collaboration and the clean interface.'
  },
  {
    name: 'Chris Lee',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    quote: 'The reminders and overdue tracking keep us on top of everything.'
  },
];

const trustedBy = [
  'Replit', 'Vercel', 'Stripe', 'Notion', 'Linear'
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black px-4 text-white">
      {/* Hero Section */}
      <div className="max-w-2xl w-full text-center flex flex-col items-center gap-8 py-20">
        <div className="flex items-center justify-center gap-2">
          <Rocket className="h-8 w-8 text-white animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Team Taskify</h1>
        </div>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Collaborate, organize, and get things done. Effortless team task management for modern teams.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-200">
            <Link href="/auth/register">
              Get Started
            </Link>
          </Button>
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-200">
            <Link href="/auth/login">
              Login
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="relative group bg-white text-black rounded-xl shadow p-6 flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1 hover:animate-jelly"
            >
              <feature.icon className="h-8 w-8 mb-2" />
              <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
              <p className="text-sm text-center">{feature.desc}</p>
              {/* Jelly Popup */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 hidden group-hover:block w-56 bg-black text-white text-sm rounded-lg shadow-lg px-4 py-3 animate-fadeIn border border-white">
                {feature.popup}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-4xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <div className="flex flex-col items-center bg-white text-black rounded-lg p-6 w-full md:w-1/3">
            <span className="font-bold text-2xl mb-2">1</span>
            <h4 className="font-semibold mb-1">Sign Up</h4>
            <p className="text-sm text-center">Create your free account and invite your team.</p>
          </div>
          <ArrowRight className="hidden md:block h-8 w-8 text-white" />
          <div className="flex flex-col items-center bg-white text-black rounded-lg p-6 w-full md:w-1/3">
            <span className="font-bold text-2xl mb-2">2</span>
            <h4 className="font-semibold mb-1">Create Tasks</h4>
            <p className="text-sm text-center">Add tasks, set priorities, and assign to teammates.</p>
          </div>
          <ArrowRight className="hidden md:block h-8 w-8 text-white" />
          <div className="flex flex-col items-center bg-white text-black rounded-lg p-6 w-full md:w-1/3">
            <span className="font-bold text-2xl mb-2">3</span>
            <h4 className="font-semibold mb-1">Track Progress</h4>
            <p className="text-sm text-center">Monitor status, get reminders, and celebrate wins!</p>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="w-full max-w-4xl mx-auto py-8">
        <h3 className="text-lg font-semibold text-center mb-4 text-gray-300">Trusted by teams at</h3>
        <div className="flex flex-wrap justify-center gap-8 opacity-80">
          {trustedBy.map((brand) => (
            <span key={brand} className="text-white text-xl font-bold tracking-wide border border-white rounded px-4 py-2 bg-black/60">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-4xl mx-auto py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white text-black rounded-xl shadow p-6 flex flex-col items-center">
              <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3 border-2 border-black" />
              <p className="italic text-center mb-2">"{t.quote}"</p>
              <span className="font-semibold">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="w-full max-w-2xl mx-auto py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to boost your team's productivity?</h2>
        <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-black hover:bg-gray-200">
          <Link href="/auth/register">
            Get Started for Free
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/20 py-6 text-center text-gray-400 text-sm mt-8">
        &copy; {new Date().getFullYear()} Team Taskify. Built with Next.js, Tailwind CSS, and ShadCN UI.
      </footer>
    </main>
  );
}
