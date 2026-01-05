import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Google from '../images/google.png'
import Facebook from '../images/facebook.png'
import Apple from '../images/apple.png'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "", password: ""
  })
  const [msg, setMsg] = useState()
  const [err, setErr] = useState()

  function handleLogin(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function submit(e) {
    e.preventDefault()

    const api = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form)
    })

    if (!api.ok) {
      setErr("Something went wrong")
      setMsg("")
    }

    const data = await api.json()

    // ✅ Store token (from backend)
    if (data.token) {
      localStorage.setItem("token", data.token)
    } else {
      setErr("Wrong Email or password.")
      setMsg("")
      return
    }

    setMsg(data.message)
    setErr("")
    setForm({
      email: "",
      password: ""
    })

    setTimeout(() => {
      navigate("/purpose")
    }, 1000)
  }

  return (
    <>
      <div className="bg-white/80 p-10 mt-10 md:mt-25 rounded-2xl shadow-lg w-[80%] md:w-[60%] mx-auto max-w-[800px]">
        <div className="flex justify-center">
          <div className="text-center">
            <p className="text-lg md:text-4xl font-bold">
              <span className="bg-linear-to-r from-blue-800 to-red-700 bg-clip-text text-transparent">
                Frenchify
              </span>{' '}
              Account
            </p>

            <Link to="/signup">
              <span className="text-blue-600">Not a user?</span>
            </Link>

            <form>
              <div className="mt-10">
                <input
                  className="h-12 w-65 md:w-80 border border-gray-300 rounded px-3"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleLogin}
                  placeholder="Email"
                />
              </div>

              <div className="mt-5">
                <input
                  className="h-12 w-65 md:w-80 border border-gray-300 rounded px-3"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleLogin}
                  placeholder="Password"
                />
              </div>

              <p className="text-red-600 text-sm text-center pt-5">{err}</p>
              <p className="text-green-600 text-sm text-center pt-5">{msg}</p>

              <button
                onClick={submit}
                className="h-12 w-65 md:w-80 rounded font-bold px-3 mt-5 text-white text-sm bg-blue-700 hover:bg-blue-800"
              >
                Continue
              </button>
            </form>

            <div className="flex justify-center items-center mt-5">
              <p className="text-gray-500 text-sm">or</p>
            </div>

            <button className="flex items-center justify-center gap-x-3 h-12 w-65 md:w-80 border-2 rounded-lg border-black px-3 mt-5 text-black text-sm hover:bg-blue-100">
              <img className="h-5 w-5" src={Google} alt="Google" />
              <p>Continue with Google</p>
            </button>

            <button className="flex items-center justify-center gap-x-3 h-12 w-65 md:w-80 border-2 rounded-lg border-black px-3 mt-5 text-black text-sm hover:bg-blue-100">
              <img className="h-5 w-5" src={Apple} alt="Apple" />
              <p>Continue with Apple</p>
            </button>

            <button className="flex items-center justify-center gap-x-3 h-12 w-65 md:w-80 border-2 rounded-lg border-black px-3 mt-5 text-black text-sm hover:bg-blue-100">
              <img className="h-5 w-5" src={Facebook} alt="Facebook" />
              <p>Continue with Facebook</p>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login