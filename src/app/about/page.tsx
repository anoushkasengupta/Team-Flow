export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-white">About Us</h1>
          <p className="text-lg text-gray-200 mb-6">
            <b>Taskify</b> is a modern, collaborative team task management platform designed to help teams organize, track, and complete their work efficiently.
          </p>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-white">Our Mission</h2>
            <p className="text-gray-300">
              Empower teams to work together seamlessly, stay organized, and achieve their goals with clarity and transparency.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-white">Meet the Team</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <li>
                <div className="font-bold text-white">Jane Doe</div>
                <div className="text-gray-400">Founder & Product Lead</div>
              </li>
              <li>
                <div className="font-bold text-white">Alex Johnson</div>
                <div className="text-gray-400">Lead Developer</div>
              </li>
              <li>
                <div className="font-bold text-white">Priya Patel</div>
                <div className="text-gray-400">Backend Engineer</div>
              </li>
              <li>
                <div className="font-bold text-white">Chris Lee</div>
                <div className="text-gray-400">UI/UX Designer</div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
} 