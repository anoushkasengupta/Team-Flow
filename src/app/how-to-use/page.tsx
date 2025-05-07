export default function HowToUsePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-white">How to Use Taskify</h1>
          <ol className="list-decimal list-inside space-y-4 text-gray-200">
            <li>
              <b>Sign Up & Create a Team:</b> Register and invite your teammates.
            </li>
            <li>
              <b>Create Tasks:</b> Add tasks, set due dates, priorities, and assign to team members.
            </li>
            <li>
              <b>Track Progress:</b> Use the dashboard and calendar to monitor task status and deadlines.
            </li>
            <li>
              <b>Collaborate:</b> Comment on tasks, update statuses, and get notified of changes.
            </li>
            <li>
              <b>Manage Team:</b> Add or remove members, assign roles, and control permissions.
            </li>
          </ol>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-white">Need Help?</h2>
            <p className="text-gray-300">Check our <a href="/docs" className="text-blue-400 underline">documentation</a> or contact support.</p>
          </div>
        </div>
      </div>
    </main>
  );
} 