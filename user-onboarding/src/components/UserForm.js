import React, { useState, useEffect } from "react";
import { Form, Field, withFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";

const UserForm = ({ errors, touched, values, status }) => {
  const [users, setUsers] = useState([]);
  console.log(users);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [users, status]);

  return (
    <div className="user-form">
      <h1>User Onboarding:</h1>
      <Form>
        <Field component="input" type="text" name="name" placeholder="Name" />
        <br />
        <Field
          component="input"
          type="password"
          name="password"
          placeholder="Password"
        />
        <br />
        <Field
          component="input"
          type="email"
          name="email"
          placeholder="Email"
        />
        <br />
        <label className="checkbox-container">
          <Field type="checkbox" name="terms" checked={values.terms} />
          Terms of Service
          <span className="checkmark" />
        </label>
        <br />
        <button type="submit">Submit!</button>
        <br />
        {touched.name && errors.name && <p className="error">{errors.name}</p>}
        <br />
        {touched.password && errors.password && (
          <p className="error">{errors.password}</p>
        )}
        <br />
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}
        <br />
        {touched.terms && errors.terms && (
          <p className="error">{errors.terms}</p>
        )}
      </Form>
      {users.map(user => (
        <div>
          {" "}
          <p key={user.id}>
            {user.name}
            <br /> {user.password}
            <br /> {user.email}
          </p>
        </div>
      ))}
    </div>
  );
};
const formikLoginForm = withFormik({
  mapPropsToValues({ name, password, email, terms }) {
    return {
      name: name || "",
      password: password || "",
      email: email || "",
      terms: terms || false
    };
  },
  validationSchema: Yup.object().shape({
    user: Yup.string().required("not a good input"),
    password: Yup.string().min(6, "Password must be at least 6 characters!"),
    // .required("Password is Required"),
    email: Yup.string()
      .email("Email is not valid!")
      .required("Email is Required"),
    terms: Yup.bool().oneOf(
      [true],
      "You must agree to the Terms of Service to Proceed"
    )
    // .required("You must agree to the Terms of Service to Proceed")
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    console.log(values);
    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        console.log("handleSubmit: then: res: ", res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.error("handleSubmit: catch: err: ", err));
  }
});
const LoginF = formikLoginForm(UserForm);
export default LoginF;
