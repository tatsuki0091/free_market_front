import React from "react";
import {
  setOpenSignIn,
  resetOpenSignUp,
  selectOpenSignUp,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncGetMyProf,
  fetchAsyncLogin,
  fetchAsyncRegister,
  selectIsLoadingAuth,
  fetchAsyncCreateProf,
} from "./authSlice";
import Modal from "react-modal";
import { Formik } from "formik";
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
const SignUp: React.FC = () => {
  // Modalのステート（初期値はfalse)
  const openSignUp = useSelector(selectOpenSignUp);
  const dispatch: AppDispatch = useDispatch();
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  return (
    <>
      <Modal
        isOpen={openSignUp}
        style={customStyles}
        onRequestClose={async () => {
          await dispatch(resetOpenSignUp());
        }}
      >
        <h1 className={authStyle.modalTitle}>Free Market</h1>
        <Formik
          initialErrors={{ email: "required" }}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const resultReg = await dispatch(fetchAsyncRegister(values));
            if (fetchAsyncRegister.fulfilled.match(resultReg)) {
              await dispatch(fetchAsyncLogin(values));
              await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
              await dispatch(fetchAsyncGetMyProf());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignUp());
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
              {touched.password && errors.password ? (
                <div className={authStyle.validateFont}>{errors.password}</div>
              ) : null}
              <br />
              <Button
                className={authStyle.form}
                type="submit"
                variant="contained"
                color="default"
                disabled={!isValid}
              >
                Register
              </Button>
            </form>
          )}
        />

        <br />
        <div className={authStyle.auth_text}>
          <span
            className={authStyle.auth_text}
            onClick={async () => {
              await dispatch(setOpenSignIn());
              await dispatch(resetOpenSignUp());
            }}
          >
            You already have an account ?
          </span>
        </div>
      </Modal>
    </>
  );
};

export default SignUp;
