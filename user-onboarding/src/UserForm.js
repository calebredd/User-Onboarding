import React, { useState, useEffect } from "react";
import { Form, Field, withFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";

const UserForm = ({ touched, errors, values, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (status) {
      setUsers([...users, status]);
    }
  }, [status]);

  return (
    <div className="user-form">
      <Form>
        <Field component="input" type="text" name="name" placeholder="Name" />
        <Field
          component="input"
          type="password"
          name="password"
          placeholder="Password"
        />
        <Field
          component="input"
          type="email"
          name="email"
          placeholder="Email"
        />
        <label className="checkbox-container">
          <Field type="checkbox" name="terms" checked={values.terms} />
          Terms of Service
          <span className="checkmark" />
        </label>
        <button>Submit!</button>
        {touched.name && errors.name && <p className="error">{errors.name}</p>}
        {touched.password && errors.password && (
          <p className="error">{errors.password}</p>
        )}
        {touched.email && errors.email && (
          <p className="error">{errors.email}</p>
        )}
        {touched.terms && errors.terms && (
          <p className="error">{errors.terms}</p>
        )}
      </Form>
      {users.map(user => (
        <p key={user.id}>{user.email}</p>
      ))}
    </div>
  );
};
const propsToValuesMap = {
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
    password: Yup.string()
      .min(6, "Password must be at least 6 characters!")
      .required("Password is Required"),
    email: Yup.string()
      .email("Email is not valid!")
      .required("Email is Required"),
    terms: Yup.bool()
      .test(
        "consent",
        "You must agree to the Terms of Service to Proceed",
        value => value === true
      )
      .required("You must agree to the Terms of Service to Proceed")
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        console.log("handleSubmit: then: res: ", res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.error("handleSubmit: catch: err: ", err));
  }
};

export default withFormik(propsToValuesMap)(UserForm);
