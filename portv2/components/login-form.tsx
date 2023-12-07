import { Formik, Field, Form, FormikHelpers } from "formik";
import styles from "./login-form.module.css";
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
          //   console.log("submitted");

          // Send the password to the backend
          fetch("http://localhost:8888/api/auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: values.username,
              password: values.password,
            }),
          })
            .then((data) => {
              // Check if the response is JSON
              if (
                data.headers.get("content-type")?.includes("application/json")
              ) {
                return data.json();
              } else {
                // If not JSON, handle accordingly (you might need a different approach)
                return { success: false, message: "Response is not JSON" };
              }
            })
            .then((jsonData) => {
              //   console.log(jsonData);
              if (jsonData.success) {
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
