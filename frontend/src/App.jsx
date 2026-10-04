import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api/v2/users";

function App() {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // SEARCH
  // =========================

  const [search, setSearch] = useState("");

  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SEARCH USERS
  // =========================

  const searchUsers = async () => {
    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("username", search.trim());
      }

      const response = await fetch(`${API_URL}?${params.toString()}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to search users");
      }

      setUsers(data.data.users);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // =========================
  // CLEAR SEARCH
  // =========================

  const clearSearch = () => {
    setSearch("");
    getUsers();
  };

  // =========================
  // GET ALL USERS
  // =========================

  const getUsers = async () => {
    try {
      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to get users");
      }

      setUsers(data.data.users);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // =========================
  // CREATE USER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

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

      // Get updated users
      getUsers();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET ONE USER
  // =========================

  const getUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error("User not found");
      }

      setSelectedUser(data.data.user);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // =========================
  // UPDATE USER
  // =========================

  const updateUser = async (id) => {
    const newUsername = prompt("Enter new username:");

    if (!newUsername) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setMessage("User updated successfully!");

      // Refresh users
      getUsers();

      // Update selected user
      setSelectedUser(data.data.user);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setMessage("User deleted successfully!");

      // Remove user from React state
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user._id !== id)
      );

      // Close selected user
      if (selectedUser?._id === id) {
        setSelectedUser(null);
      }

      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // =========================
  // GET USERS WHEN PAGE LOADS
  // =========================

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            USER MANAGEMENT
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create & Manage Users
          </h1>

          <p className="mt-2 text-slate-400">
            React + Nodejs + Express + MongoDB
          </p>
        </div>

        {/* =========================
            MESSAGE
        ========================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
            {message}
          </div>
        )}

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="grid gap-6 lg:grid-cols-5">

          {/* =========================
              CREATE USER
          ========================= */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl lg:col-span-2">

            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Create Account
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Add a new user to MongoDB.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* USERNAME */}

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

              {/* EMAIL */}

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

              {/* PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>
          </div>

          {/* =========================
              USERS
          ========================= */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl lg:col-span-3">

            {/* USERS HEADER */}

            <div className="mb-6">

              <div className="flex items-center justify-between">

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

              {/* =========================
                  SEARCH
              ========================= */}

              <div className="mt-5 flex gap-2">

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search username..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                  onClick={searchUsers}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  Search
                </button>

                <button
                  onClick={clearSearch}
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
                >
                  Clear
                </button>

              </div>

            </div>

            {/* =========================
                USER LIST
            ========================= */}

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
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700"
                  >

                    <div className="flex items-center gap-4">

                      {/* AVATAR */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold uppercase">
                        {user.username?.charAt(0)}
                      </div>

                      {/* USER INFO */}

                      <div className="min-w-0 flex-1">

                        <h3 className="truncate font-semibold text-white">
                          {user.username}
                        </h3>

                        <p className="truncate text-sm text-slate-400">
                          {user.email}
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex gap-2">

                        <button
                          onClick={() => getUser(user._id)}
                          className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                        >
                          View
                        </button>

                        <button
                          onClick={() => updateUser(user._id)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteUser(user._id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-500"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                ))

              )}

            </div>
          </div>
        </div>

        {/* =========================
            SELECTED USER
        ========================= */}

        {selectedUser && (

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  User Details
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Details returned from the backend.
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>

            </div>

            <div className="grid gap-4 sm:grid-cols-3">

              {/* USERNAME */}

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Username
                </p>

                <p className="mt-1 font-medium">
                  {selectedUser.username}
                </p>
              </div>

              {/* EMAIL */}

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="mt-1 font-medium">
                  {selectedUser.email}
                </p>
              </div>

              {/* USER ID */}

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  User ID
                </p>

                <p className="mt-1 truncate font-mono text-xs">
                  {selectedUser._id}
                </p>
              </div>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}

export default App;