import React from "react";
import Modal from "react-modal";
import { Formik } from "formik";
import {
  selectOpenSignIn,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncLogin,
  resetOpenSignIn,
  resetOpenSignUp,
  fetchAsyncGetMyProf,
  setOpenSignUp,
} from "./authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField } from "@material-ui/core";
import { AppDispatch } from "../../app/store";
import authStyle from "./Auth.module.css";
// バリデーションのためのライブラリ
import * as Yup from "yup";

const customStyles = {
  overlay: {
    backgroundColor: "#777777",
  },
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 350,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const SignIn: React.FC = () => {
  // Modalのステート（初期値はfalse)
  const openSignIn = useSelector(selectOpenSignIn);
  const dispatch: AppDispatch = useDispatch();
  // フロントエンド側のURL
  const frontUrl = process.env.REACT_FRONT_DEV_API_URL;
  return (
    <>
      <Modal isOpen={openSignIn} style={customStyles}>
        <h1 className={authStyle.modalTitle}>Free Market</h1>
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            console.log(values);
            const result = await dispatch(fetchAsyncLogin(values));
            if (fetchAsyncLogin.fulfilled.match(result)) {
              await dispatch(fetchAsyncGetMyProf());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignIn());
            // トップページにリダイレクト
            await document.location.assign(`${frontUrl}`);
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("email format is wrong")
              .required("email is must"),
            password: Yup.string().required("password is must").min(4),
          })}
          render={({
            handleSubmit,
            handleChange,
            handleBlur, // handler for onBlur event of form elements
            values,
            touched,
            errors,
          }) => (
            <>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>email</label>
                  <br />
                  <TextField
                    className={authStyle.form}
                    placeholder="email"
                    type="text"
                    name="email"
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={handleChange}
                  />
                </div>
                <br />
                {touched.email && errors.email ? (
                  <div className={authStyle.validateFont}>{errors.email}</div>
                ) : null}
                <div>
                  <label>password</label>
                  <br />
                  <TextField
                    className={authStyle.form}
                    placeholder="password"
                    type="password"
                    name="password"
                    onBlur={handleBlur}
                    value={values.password}
                    onChange={handleChange}
                  />
                </div>
                <br />
                {touched.password && errors.password ? (
                  <div className={authStyle.validateFont}>
                    {errors.password}
                  </div>
                ) : null}
                <br />
                <Button
                  className={authStyle.form}
                  type="submit"
                  variant="contained"
                  color="default"
                >
                  Login
                </Button>
              </form>
            </>
          )}
        />

        <br />
        <Button
          className={authStyle.form}
          variant="contained"
          color="default"
          onClick={async () => {
            await dispatch(resetOpenSignIn());
          }}
        >
          Close
        </Button>

        <br />
        <br />
        <div className={authStyle.auth_text}>
          <span
            onClick={async () => {
              await dispatch(setOpenSignUp());
              await dispatch(resetOpenSignIn());
            }}
          >
            You don't have an account ?
          </span>
        </div>
      </Modal>
    </>
  );
};

export default SignIn;
