import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthenticationPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { signin, signup, signInWithGoogle, errors: authErrors } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggleForm = () => setIsLogin((prev) => !prev);

  const onSubmit = (data) => {
    isLogin ? signin(data) : signup(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <button
          onClick={() => (navigate("/"), { replace: true })}
          className="absolute top-4 left-4 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition duration-300"
        >
          Home
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h1>
        {authErrors && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{authErrors}</span>
          </div>
        )}
        <button
          onClick={signInWithGoogle}
          className="w-full bg-red-500 text-white py-2 px-4 rounded mb-4 hover:bg-red-600 transition duration-300"
        >
          Sign in with Google
        </button>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                {...register("username", { required: !isLogin })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.username && (
                <p className="text-red-500 mt-1">Username is required</p>
              )}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              {...register("email", { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 mt-1">Email is required</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              {...register("password", { required: true })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 mt-1">Password is required</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <button
          className="mt-4 text-blue-500 hover:underline"
          onClick={toggleForm}
        >
          {isLogin ? "¿Don't have an account?" : "¿Already have an account?"}
        </button>
      </div>
    </div>
  );
};

export default AuthenticationPage;
