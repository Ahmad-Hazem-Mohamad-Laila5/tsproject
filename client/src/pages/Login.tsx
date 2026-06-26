import React, { useState } from "react";
import herobg from "../assets/hero_bg.jpeg";
import { Link } from "react-router-dom";
import { BiBasket, BiUser } from "react-icons/bi";
import { CgPassword } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import { LoaderIcon } from "react-hot-toast";
const Login = () => {
  const [isLoginState, setIsLoginState] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => (window.location.href = "/"), 1000);
  };
  return (
    <div className=" min-h-screen flex">
      {/* {left side} */}
      <div className=" hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
        <img
          src={herobg}
          alt=""
          className=" absolute inset-0 object-cover h-full bg-center opacity-10"
        />
        <div className=" relative text-center px-12">
          <h2 className=" text-4xl font-semibold text-white mb-4">
            welocom back to{" "}
          </h2>
          <p className=" text-white/60 font-serif text-xl max-w-sm mx-auto">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum
            sunt, ducimus et nisi quis sapiente.
          </p>
        </div>
      </div>
      {/* {right side} */}
      <div className=" flex-1 flex-center px-4 py-12 bg-app-cream">
        <div className=" w-full max-w-md">
          {/* from header message */}
          <div className=" text-center mb-8">
            <Link to={"/"} className=" inline-flex items-center gap-2 mb-6">
              <BiBasket className=" size-8 text-app-green" />
              <span className=" text-2xl font-semibold text-app-green">
                INsasas
              </span>
            </Link>
            <h1 className=" text-2xl font-semibold text-app-green mb-2">
              {isLoginState
                ? "Sign in to your account"
                : "Sign up for an account"}
            </h1>
            <p className=" text-sm text-app-text-light">
              {isLoginState
                ? "Dont have an account"
                : "already have an account"}
              <button
                onClick={() => setIsLoginState(!isLoginState)}
                className=" text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors"
              >
                {isLoginState ? "Create One" : "Sign in"}
              </button>
            </p>
          </div>
          {/* login / register */}
          <form action="" className=" space-y-5">
            {!isLoginState && (
              <label htmlFor="" className=" text-sm flex flex-col gap-1">
                Name
                <div className=" relative">
                  <BiUser className=" absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="your name"
                    className=" w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                  />
                </div>
              </label>
            )}
            <label htmlFor="" className=" text-sm flex flex-col gap-1">
              email
              <div className=" relative">
                <MdEmail className=" absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your name"
                  className=" w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                />
              </div>
            </label>
            <label htmlFor="" className=" text-sm flex flex-col gap-1">
              password
              <div className=" relative">
                <CgPassword className=" absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="your name"
                  className=" w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className=" flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <LoaderIcon className=" animate-spin" />
              ) : isLoginState ? (
                "Sign In"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
