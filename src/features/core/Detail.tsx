import React, { useEffect, useState } from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { PROPS_POST } from "../types";
import Header from "./Header";
import { RouteComponentProps } from "react-router-dom";
import styles from "./Core.module.css";
//import styles from "../post/Post.module.css";
import { Avatar, Divider, Button } from "@material-ui/core";
import { selectProfiles, fetchAsyncGetProfs } from "../user/authSlice";
import {
  selectComments,
  fetchAsyncGetComments,
  fetchAsyncGetDetailPost,
  selectDetailPost,
} from "../post/postSlice";

type PageProps = PROPS_POST & RouteComponentProps<{ id: string }>;

const Detail: React.FC<PageProps> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const [id, setId] = useState(props.match.params.id);
  const detailPost = useSelector(selectDetailPost);
  const profiles = useSelector(selectProfiles);
  const comments = useSelector(selectComments);
  const prof = profiles.filter((prof) => {
    return prof.userProfile === detailPost.userPost;
  });

  useEffect(() => {
    const fetchBootLoader = async () => {
      const packet = { id: id };
      await dispatch(fetchAsyncGetDetailPost(packet));
      await dispatch(fetchAsyncGetProfs());
      await dispatch(fetchAsyncGetComments());
    };

    fetchBootLoader();
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className={styles.core_posts}>
        <div className={styles.detail_post}>
          <div className={styles.detail_post_header}>
            <Avatar className={styles.detail_post_avatar} src={prof[0]?.img} />
            <h3>{prof[0]?.nickName}</h3>
          </div>
          <img
            className={styles.detail_post_image}
            src={detailPost?.img}
            alt=""
          />
          <h3 className={styles.detail_post_title}>{detailPost?.title}</h3>
          <h3 className={styles.detail_post_price}>${detailPost?.price}</h3>
          <h4 className={styles.detail_post_price}>
            <strong> {detailPost?.description}</strong>
            {/* <AvatarGroup max={7}>
            {liked.map((like) => (
              <Avatar
                className={styles.post_avararGroup}
                key={like}
                src={profiles.find((prof) => prof.userProfile === like)?.img}
              />
            ))}
          </AvatarGroup> */}
          </h4>
          <div className={styles.detail_purchase}>
            <Button
              variant="contained"
              color="default"
              onClick={async () => {
                //await dispatch(setOpenSignUp());
              }}
            >
              Purchase
            </Button>
          </div>
          <br />
        </div>

        {/* <Divider />
        <div className={styles.detail_post_comments}></div> */}
      </div>

      {/* {commentsOnPost.map((comment) => (
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
        {postButton()} */}
    </>
  );
};

export default Detail;
