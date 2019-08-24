import React, { useState, useEffect } from "react";
import { Form, Field, withFormik } from "formik";
import axios from "axios";
import * as yup from "yup";

const UserForm = ({ errors, touched, values, status }) => {
  const [users, setUsers] = useState([]);
  console.log(users);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div className="user-form">
      <h1>User Onboarding:</h1>
      <Form>
        <Field component="input" type="text" name="name" placeholder="Name" />
        <br />
        {touched.name && errors.name && <p className="error">{errors.name}</p>}
        <br />
        <Field
          component="input"
          type="password"
          name="password"
          placeholder="Password"
        />
        <br />
        {touched.password && errors.password && (
          <p className="error">{errors.password}</p>
        )}
        <br />
        <Field
          component="input"
          type="email"
          name="email"
          placeholder="Email"
        />
        <br />
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}
        <br />
        <label className="checkbox-container">
          <Field type="checkbox" name="terms" checked={values.terms} />
          Terms of Service
          <span className="checkmark" />
        </label>
        {touched.terms && errors.terms && (
          <p className="error">{errors.terms}</p>
        )}
        <br />
        <button type="submit">Submit!</button>
        <br />
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
  validationSchema: yup.object().shape({
    user: yup.string().required("not a good input"),
    password: yup.string().min(6, "Password must be at least 6 characters!"),
    // .required("Password is Required"),
    email: yup
      .string()
      .email("Email is not valid!")
      .required("Email is Required"),
    terms: yup
      .bool()
      .oneOf([true], "You must agree to the Terms of Service to Proceed")
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
