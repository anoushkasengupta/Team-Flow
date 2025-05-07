export default function DocsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur rounded-xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-white">Documentation</h1>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-white">Technologies Used</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Next.js 14</li>
              <li>Node.js</li>
              <li>PostgreSQL or MongoDB</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui</li>
              <li>Socket.io (for real-time features)</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-white">Setup Instructions</h2>
            <ol className="list-decimal list-inside text-gray-200 space-y-1">
              <li>Clone the repository</li>
              <li>Install dependencies: <code className="bg-black/60 text-gray-200 rounded px-1">npm install</code></li>
              <li>Configure your <code className="bg-black/60 text-gray-200 rounded px-1">.env</code> file for database and environment variables</li>
              <li>Run the development server: <code className="bg-black/60 text-gray-200 rounded px-1">npm run dev</code></li>
            </ol>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-white">Folder Structure</h2>
            <pre className="bg-black/60 text-gray-200 rounded p-4 text-sm overflow-x-auto">
{`
/src
  /app
    /dashboard
      /tasks
      /team
      /calendar
      /settings
    /about
    /pricing
    /how-to-use
    /docs
  /components
    /ui
    /layout
    Navbar.tsx
  /lib
  /types
`}
            </pre>
          </section>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-white">API Overview</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li><b>Auth:</b> Register, Login, Logout, Session</li>
              <li><b>Tasks:</b> CRUD, Assign, Filter, Search</li>
              <li><b>Team:</b> List, Add, Remove, Update Roles</li>
              <li><b>Calendar:</b> Get tasks by date</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2 text-white">Roles & Permissions</h2>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li><b>Owner:</b> Full access, manage team, settings</li>
              <li><b>Member:</b> Manage own tasks, view team</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
} 