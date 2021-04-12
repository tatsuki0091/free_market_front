import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Core.module.css";
import { File } from "../types";

import {
  selectOpenNewPost,
  resetOpenNewPost,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncNewPost,
} from "../post/postSlice";

import {
  Button,
  TextField,
  TextareaAutosize,
  IconButton,
} from "@material-ui/core";
import { MdAddAPhoto } from "react-icons/md";

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

const NewPost: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openNewPost = useSelector(selectOpenNewPost);
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };
  const newPost = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      title: title,
      img: image,
      price: price,
      description: description,
    };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncNewPost(packet));
    await dispatch(fetchPostEnd());
    setTitle("");
    setImage(null);
    dispatch(resetOpenNewPost());
  };
  return (
    <>
      <Modal
        isOpen={openNewPost}
        onRequestClose={async () => {
          await dispatch(resetOpenNewPost());
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>SNS Clone</h1>
          <br />
          <TextField
            placeholder="Please enter caption"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <TextField
            placeholder="Please enter price"
            type="number"
            onChange={(e) => setPrice(e.target.value)}
          />
          <br />
          <TextareaAutosize
            placeholder="Please enter description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <br />
          <input
            type="file"
            id="imageInput"
            hidden={true}
            onChange={(e) => setImage(e.target.files![0])}
          />
          <IconButton onClick={handleEditPicture}>
            <MdAddAPhoto />
          </IconButton>
          <br />
          <Button
            disabled={!title || !image}
            variant="contained"
            color="primary"
            onClick={newPost}
          >
            New Post
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default NewPost;
