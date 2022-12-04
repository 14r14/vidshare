import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function Register() {
  const [err, setErr] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = () => {
    const email = getValues("email");
    const username = getValues("username");
    const password = getValues("password");
    const confirmPassword = getValues("cpassword");

    if (password !== confirmPassword) {
      return setError(
        "cpassword",
        {
          type: "nomatch",
        },
        {
          shouldFocus: true,
        }
      );
    }
    fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        cpassword: confirmPassword,
      }),
    })
      .then(async (res) => {
        if (res.status === 201) {
          navigate("/");
        } else if (res.status === 403) {
          const err = await res.json();
          const errObj = err.error;
          switch (errObj.param) {
            case "email":
              switch (errObj.msg) {
                case "required":
                  return setError(
                    "email",
                    {
                      type: "required",
                    },
                    {
                      shouldFocus: true,
                    }
                  );
                case "pattern":
                  return setError(
                    "email",
                    {
                      type: "pattern",
                    },
                    { shouldFocus: true }
                  );
              }
              break;
            case "username":
              switch (errObj.msg) {
                case "required":
                  return setError("username", {
                    type: "required",
                  });
                case "minLength":
                  return setError("username", {
                    type: "minLength",
                  });
              }
              break;
            case "password":
              switch (errObj.msg) {
                case "required":
                  return setError("password", {
                    type: "required",
                  });
                case "minLength":
                  return setError("password", {
                    type: "minLength",
                  });
              }
              break;
            case "confirmPassword":
              switch (errObj.msg) {
                case "required":
                  return setError("cpassword", {
                    type: "required",
                  });
                case "nomatch":
                  return setError("cpassword", {
                    type: "nomatch",
                  });
              }
              break;
          }
          return "validationError";
        } else {
          const data = await res.json();
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        if (err.message === "User already exists") {
          setErr("User already exists");
        } else {
          setErr("Something went wrong, please try again.");
        }
      });
  };

  return (
    <div>
      {err && <p className="text-red-500 m-3">{err}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="m-3">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="border-2 border-gray-400 rounded-lg p-1 ml-3"
            placeholder="Email"
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+$/i,
            })}
          />
          {errors.email?.type === "required" && <p>Email is required.</p>}
          {errors.email?.type === "pattern" && <p>Email invalid.</p>}
        </div>
        <div className="m-3">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="border-2 border-gray-400 rounded-lg p-1 ml-3"
            placeholder="Username"
            {...register("username", { required: true, minLength: 3 })}
          />
          {errors.username?.type === "required" && <p>Email is required.</p>}
          {errors.username?.type === "minLength" && (
            <p>Username must be at least 3 characters.</p>
          )}
        </div>
        <div className="m-3">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="border-2 border-gray-400 rounded-lg p-1 ml-3"
            placeholder="Password"
            {...register("password", {
              required: true,
              minLength: 8,
            })}
          />
          {errors.password?.type === "required" && <p>Password is required.</p>}
          {errors.password?.type === "minLength" && (
            <p>Password must be at least 8 characters.</p>
          )}
        </div>
        <div className="m-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            className="border-2 border-gray-400 rounded-lg p-1 ml-3"
            placeholder="Confirm Password"
            {...register("cpassword", {
              required: true,
              minLength: 8,
            })}
          />
          {errors.cpassword?.type === "required" && (
            <p>Please confirm your password.</p>
          )}
          {errors.cpassword?.type === "minLength" && (
            <p>Password must be at least 8 characters.</p>
          )}
          {errors.cpassword?.type === "nomatch" && <p>Passwords must match.</p>}
        </div>
        <div className="m-3">
          <button
            type="submit"
            className="p-3 bg-blue-500 rounded-lg text-white"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
