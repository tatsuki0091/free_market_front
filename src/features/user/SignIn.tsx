import React, { useState } from "react";
import Modal from "react-modal";
import { Formik } from "formik";
import {
  selectOpenSignIn,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncLogin,
  resetOpenSignIn,
  fetchAsyncGetMyProf,
  setOpenSignUp,
  selectIsLoadingAuth,
  setOpenSignIn,
} from "./authSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField, CircularProgress } from "@material-ui/core";
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
  //const frontUrl = process.env.REACT_FRONT_DEV_API_URL;
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const [message, setMessage] = useState("");
  return (
    <>
      <Modal
        isOpen={openSignIn}
        onRequestClose={async () => {
          await dispatch(resetOpenSignIn());
        }}
        style={customStyles}
      >
        <h1 className={authStyle.modalTitle}>Free Market</h1>
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const result = await dispatch(fetchAsyncLogin(values));
            if (fetchAsyncLogin.fulfilled.match(result)) {
              await dispatch(fetchAsyncGetMyProf());
              await dispatch(fetchCredEnd());
              await dispatch(resetOpenSignIn());
              // エラーメッセージがあれば削除
              if (message !== "") {
                setMessage("");
              }
            } else {
              setMessage("Your email address or password is wrong");
              // 入力した値を残したいのであればawait dispatch(resetOpenSignIn());を削除
              await dispatch(resetOpenSignIn());
              await dispatch(fetchCredEnd());
              await dispatch(setOpenSignIn());
            }
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
            isValid,
          }) => (
            <>
              <form onSubmit={handleSubmit}>
                <div className={authStyle.auth_progress}>
                  {isLoadingAuth && <CircularProgress />}
                </div>
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
                {message !== "" ? (
                  <div className={authStyle.validateFont}>{message}</div>
                ) : null}
                <br />
                <Button
                  className={authStyle.form}
                  type="submit"
                  variant="contained"
                  color="default"
                  disabled={!isValid}
                >
                  Login
                </Button>
              </form>
            </>
          )}
        />

        {/* <br />
        <Button
          className={authStyle.form}
          variant="contained"
          color="default"
          onClick={async () => {
            await dispatch(resetOpenSignIn());
          }}
        >
          Close
        </Button> */}

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
