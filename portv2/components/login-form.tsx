import { Formik, Field, Form, FormikHelpers } from "formik";
import styles from "./login-form.module.css";
import bcrypt from "bcryptjs";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/router";

interface Values {
  username: string;
  password: string;
}
export default function LoginForm() {
  const { isLoggedIn, login, logout } = useAuth();

  const router = useRouter();

  return (
    <div className={styles.login_box + " p-3"}>
      <h1 className="display-6 mb-3">Login</h1>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          console.log("submitted");
          // Hash the password using bcryptjs
          const hashedPassword = bcrypt.hashSync(values.password, 10);
          console.log("hashed", hashedPassword);
          console.log("password", values.password);
          // Send the hashed password to the backend
          fetch("http://localhost:8888/api/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: values.username,
              password: hashedPassword,
            }),
          })
            .then((data) => {
              console.log(data);
              if (data.ok) {
                login();
                router.push("/home");
              } else {
                alert("Invalid username or password");
              }
            })
            .catch((error) => {
              console.error("Error during login:", error);
              alert("An unexpected error occurred");
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        <Form>
          <div className="mb-3">
            <Field
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              aria-describedby="usernameHelp"
            />
          </div>

          <div className="mb-3">
            <Field
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              type="password"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </Form>
      </Formik>
    </div>
  );
}
