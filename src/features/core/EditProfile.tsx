import React, { useEffect, useState, createContext } from "react";
import Modal from "react-modal";
import styles from "./Core.module.css";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { File } from "../types";
import { resetOpenNewPost } from "../post/postSlice";
import authStyle from "../user/Auth.module.css";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";

import {
  editNickname,
  selectProfile,
  selectOpenProfile,
  resetOpenProfile,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateProf,
  editPostCode,
  editAddress1,
  editAddress2,
  editPhoneNumber,
  fetchAsyncGetMyProf,
} from "../user/authSlice";

import { Button, TextField, IconButton } from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";

// modalのCSS
const customStyles = {
  // ボタンの色
  overlay: {
    backgroundColor: "#777777",
  },
  // modalの配置
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 350,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const EditProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const profile = useSelector(selectProfile);
  const history = useHistory();

  // 画像のstateで初期値はnullに設定
  const [image, setImage] = useState<File | null>(null);

  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      id: profile.id,
      nickName: profile.nickName,
      img: image,
      postCode: profile.postCode,
      address1: profile.address1,
      address2: profile.address2,
      phoneNumber: profile.phoneNumber,
    };

    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(packet));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
    window.location.reload();
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetMyProf());
    };
    fetchBootLoader();
  }, [dispatch]);

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  //

  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
          await dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <Formik
          initialErrors={{ postCode: "required" }}
          initialValues={{
            id: profile.id,
            nickName: profile.nickName,
            img: image,
            postCode: profile.postCode,
            address1: profile.address1,
            address2: profile.address2,
            phoneNumber: profile.phoneNumber,
          }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const result = await dispatch(fetchAsyncUpdateProf(values));
            if (fetchAsyncUpdateProf.fulfilled.match(result)) {
              await dispatch(resetOpenProfile());
            }
            await dispatch(fetchCredEnd());
          }}
          validationSchema={Yup.object().shape({
            nickName: Yup.string().required("Nickname is required"),
            postCode: Yup.string().matches(
              /(?=.*[0-9])\S$/,
              "Post code must be numbers or null"
            ),
            phoneNumber: Yup.string().matches(
              /[^0-9]+$/,
              "Phone Number must be numbers"
            ),
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
            <form className={styles.core_signUp}>
              <h1 className={styles.core_title}>SNS free market</h1>
              <br />
              <TextField
                placeholder="nickname"
                type="text"
                value={profile?.nickName}
                onChange={(e) => dispatch(editNickname(e.target.value))}
              />
              <TextField
                placeholder="postcode"
                onBlur={handleBlur}
                type="text"
                name="postCode"
                value={profile?.postCode}
                onChange={(e) => dispatch(editPostCode(e.target.value))}
              />
              {touched.postCode && errors.postCode ? (
                <div className={authStyle.validateFont}>{errors.postCode}</div>
              ) : null}
              <TextField
                placeholder="address1"
                type="text"
                value={profile?.address1}
                onChange={(e) => dispatch(editAddress1(e.target.value))}
              />
              <TextField
                placeholder="address2"
                type="text"
                value={profile?.address2}
                onChange={(e) => dispatch(editAddress2(e.target.value))}
              />
              <TextField
                placeholder="phoneNumber"
                type="text"
                value={profile?.phoneNumber}
                name="phoneNumber"
                onChange={(e) => dispatch(editPhoneNumber(e.target.value))}
              />

              <input
                type="file"
                id="imageInput"
                hidden={true}
                onChange={(e) => setImage(e.target.files![0])}
              />
              <br />
              <IconButton onClick={handleEditPicture}>
                <MdAddAPhoto />
              </IconButton>
              <br />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={updateProfile}
              >
                Update
              </Button>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  await dispatch(resetOpenProfile());
                  history.push(`/cart`);
                }}
              >
                Cart
              </Button>

              <br />
              <Button
                variant="contained"
                color="default"
                onClick={async () => {
                  localStorage.removeItem("localJWT");
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  // ページを更新
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </form>
          )}
        />
      </Modal>
    </>
  );
};

export default EditProfile;
