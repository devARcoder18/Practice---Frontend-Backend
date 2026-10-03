
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/v2/users/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message?.message || "Something went wrong"
        );
      }

      setMessage("Account created successfully!");

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      // Refresh users after creating a new user
      const usersResponse = await fetch(
        "http://localhost:3000/api/v2/users/"
      );

      const usersData = await usersResponse.json();

      setUsers(usersData.data.users);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v2/users/"
        );

        const data = await response.json();

        setUsers(data.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      {/* Message */}
            {message && (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-3 text-center text-sm text-slate-300">
                {message}
              </div>
            )}
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            USER MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create & Manage Users
          </h1>

          <p className="mt-2 text-slate-400">
            React + Tailwind CSS + Express + MongoDB
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-5">

          {/* Registration Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl lg:col-span-2">

            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Create Account
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Add a new user to your database.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum Eight Characters, One Uppercase and Number"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            
          </div>

          {/* Users */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl lg:col-span-3">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  All Users
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Users stored in MongoDB
                </p>
              </div>

              <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-300">
                {users.length} Users
              </div>
            </div>

            {/* User List */}
            <div className="space-y-3">

              {users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center">
                  <p className="text-slate-400">
                    No users found.
                  </p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700"
                  >

                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold uppercase">
                      {user.username?.charAt(0)}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-white">
                        {user.username}
                      </h3>

                      <p className="truncate text-sm text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    {/* Status */}
                    <span className="hidden rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 sm:block">
                      Active
                    </span>
                  </div>
                ))
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;