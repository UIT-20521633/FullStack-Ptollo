import Cards1 from "~/assets/img/Landingpage_img/background.jpg";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "~/index.css"

import { useState } from "react";
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div
      className="flex items-center justify-center h-screen font-sora  bg-cover bg-center bg-no-repeat  from-purple-900 to-purple-700 text-white"
      style={{ backgroundImage: `url(${Cards1})` }}>
      <div className="w-96 p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-white mb-6">
          Login
        </h2>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="font-sora w-full px-4 py-2 text-15 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 text-gray-700 font-sora text-15 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-cyan-500 hover:text-cyan-700">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-white text-15">
              <input type="checkbox" className="mr-2" />
              Remember
            </label>
            <a href="#" className="text-white hover:underline text-14">
              Forgot your password ?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition">
            Login
          </button>
        </form>

        <p className="text-center text-white mt-4">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-cyan-300 hover:underline">
            Sign up
          </a>
        </p>
        <div className="mt-6 space-y-3">
          <div className="flex items-center my-6">
            <div className="h-px flex-grow bg-white/30"></div>
            <span className="px-3 text-white text-sm opacity-75">
              Or sign in with
            </span>
            <div className="h-px flex-grow bg-white/30"></div>
          </div>

          <button className="text-14 w-full flex items-center justify-center py-2 border border-white rounded-md hover:bg-white hover:text-black transition">
            <FaGoogle className="mr-2" />
            Login with Google
          </button>

          <button className="text-14 w-full flex items-center justify-center py-2 border border-white rounded-md hover:bg-white hover:text-black transition">
            <FaFacebook className="mr-2" />
            Login with Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
