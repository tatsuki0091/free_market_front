import React, { useState } from "react";
import styles from "./Post.module.css";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Divider, Checkbox } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

import AvatarGroup from "@material-ui/lab/AvatarGroup";

import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { PROPS_POST } from "../types";
import {
  selectProfiles,
  setOpenSignIn,
  resetOpenSignUp,
} from "../user/authSlice";
import {
  selectComments,
  fetchAsyncPostComment,
  fetchPostStart,
  fetchPostEnd,
} from "../post/postSlice";

const Post: React.FC<PROPS_POST> = ({
  postId,
  userPost,
  title,
  imageUrl,
  liked,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const comments = useSelector(selectComments);
  const commentsOnPost = comments.filter((com) => {
    return com.post === postId;
  });
  const [text, setText] = useState("");

  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    // 無駄なリフレッシュを無効化
    e.preventDefault();
    const packet = { text: text, post: postId };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPostComment(packet));
    await dispatch(fetchPostEnd());
    setText("");
  };

  const postButton = () => {
    if (localStorage.localJWT) {
      return (
        <form className={styles.post_commentBox}>
          <input
            className={styles.post_input}
            type="text"
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            disabled={!text.length}
            className={styles.post_button}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      );
    } else {
      return (
        <div className={styles.post_commentBox}>
          <input
            className={styles.post_input}
            type="text"
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            disabled={!text.length}
            className={styles.post_button}
            type="submit"
            onClick={async () => {
              await dispatch(setOpenSignIn());
            }}
          >
            Post
          </button>
        </div>
      );
    }
  };

  if (title) {
    return (
      <>
        <div className={styles.post}>
          <div className={styles.post_header}>
            <Avatar className={styles.post_avatar} src={prof[0]?.img} />
            <h3>{prof[0]?.nickName}</h3>
          </div>
          <button
          // onClick={() =>
          //   history.push("/hello/react-router?message=hooks#test")
          // }
          >
            <img
              className={styles.post_image}
              src={imageUrl}
              alt="dddddddddd"
            />
          </button>

          <h4 className={styles.post_text}>
            <Checkbox
              className={styles.post_checkbox}
              icon={<FavoriteBorder />}
              checkedIcon={<Favorite />}
              //   checked={liked.some((like) => like === loginId)}
              //   onChange={handlerLiked}
            />
            <strong> {prof[0]?.nickName}</strong> {title}
            <AvatarGroup max={7}>
              {liked.map((like) => (
                <Avatar
                  // ここのぶぶんを郵政
                  className={styles.post_avararGroup}
                  key={like}
                  src={profiles.find((prof) => prof.userProfile === like)?.img}
                />
              ))}
            </AvatarGroup>
          </h4>

          <Divider />
          <div className={styles.post_comments}>
            {commentsOnPost.map((comment) => (
              <div key={comment.id} className={styles.post_comment}>
                <Avatar
                  src={
                    profiles.find(
                      (prof) => prof.userProfile === comment.userComment
                    )?.img
                  }
                />
                <p>
                  <strong className={styles.post_strong}>
                    {
                      profiles.find(
                        (prof) => prof.userProfile === comment.userComment
                      )?.nickName
                    }
                  </strong>
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
          {postButton()}
        </div>
      </>
    );
  }
  return null;
};

export default Post;
