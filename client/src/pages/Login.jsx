
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        login: loginData.login,
        password: loginData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-white">
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[420px]">
          {/* Login heading */}
          <div className="mb-7 sm:mb-10">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              LOGIN
            </h1>

            <div className="mt-3 h-[2px] w-10 bg-orange-500" />
          </div>

          {/* Form */}
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            {/* Username / Email */}
            <div>
              <label
                htmlFor="login"
                className="mb-2 block text-sm font-medium text-white/60"
              >
                Username or Email
              </label>

              <input
                id="login"
                type="text"
                placeholder="Enter your username or email"
                value={loginData.login}
                onChange={handleChange}
                autoComplete="username"
                required
                className="w-full min-w-0 border border-white/10 bg-white/[0.03] px-3 py-3.5 text-base text-white outline-none transition placeholder:text-sm placeholder:text-white/20 focus:border-orange-500/70 focus:bg-white/[0.05] sm:px-4 sm:text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white/60"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="shrink-0 text-xs text-white/35 transition hover:text-orange-400 sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                className="w-full min-w-0 border border-white/10 bg-white/[0.03] px-3 py-3.5 text-base text-white outline-none transition placeholder:text-sm placeholder:text-white/20 focus:border-orange-500/70 focus:bg-white/[0.05] sm:px-4 sm:text-sm"
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="mt-2 w-full bg-orange-500 py-3.5 text-sm font-semibold text-black transition duration-200 hover:bg-orange-400 active:scale-[0.99]"
            >
              LOGIN
            </button>
          </form>

          {/* Register */}
          <div className="mt-7 text-center text-sm sm:mt-8">
            <span className="text-white/35">
              Don't have an account?
            </span>

            <Link
              to="/register"
              className="ml-2 font-medium text-orange-400 transition hover:text-orange-300"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
