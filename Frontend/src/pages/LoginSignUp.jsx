import React, { useState } from 'react'
import './css/LoginSignUp.css';
import { useForm } from 'react-hook-form'
import { useDispatch } from "react-redux";
import { registerUser, loginUser } from '../features/auth/authThunks';
// import { toast } from 'react-toastify';
import { useNavigate } from 'react-router'


const LoginSignUp = () => {
  const [state, setState] = useState("Sign Up");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {

    if (state === "Login") {

      const user = {
        emailOrUsername: data.email,
        password: data.password
      }
      
      dispatch(loginUser(user))
    } else {
      dispatch(registerUser(data))
    }

    navigate('/home')

  }

  return (
    <>
      <div className="loginsignup">
        <div className="loginsignup-container">
          <h1>{state}</h1>
          <form className="loginsignup-fields" onSubmit={handleSubmit(onSubmit)}>
            <div>
              {state === "Sign Up" && (
                <>
                  <input
                    {...register('username', { required: 'Name is required' })}
                    type="text"
                    placeholder='Your Name' />
                  {errors.username && (<p className="error">{errors.username.message}</p>)}
                </>
              )}
            </div>

            <div>
              <input
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
                type="email"
                placeholder="Email Address" />
              {errors.email && (<p className='error'>{errors.email.message}</p>)}
            </div>

            <div>
              <input {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: "Min 6 characters" }
              })}
                type="password"
                placeholder="Password"
              />
              {errors.password && (<p className="error">{errors.password.message}</p>)}
            </div>

            <button type="submit">Continue</button>
          </form>

          {state === "Sign Up"
            ? <p className="loginsignup-login">Already have an account? <span onClick={() => { setState("Login") }}>Login here</span></p>
            : <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>
          }

          <div className="loginsignup-agree">
            <input type="checkbox" name="" id="" />
            <p>By continuing, i agree to the terms of use & privacy policy.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginSignUp
