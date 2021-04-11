import React, { useEffect, useState } from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { PROPS_POST } from "../types";
import Header from "./Header";
import { RouteComponentProps } from "react-router-dom";
import styles from "./Core.module.css";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import { Avatar, Divider, Button } from "@material-ui/core";
import {
  selectProfiles,
  fetchAsyncGetProfs,
  selectProfile,
  fetchAsyncGetMyProf,
  setOpenSignIn,
} from "../user/authSlice";
//import * as Yup from "yup";
import {
  // selectComments,
  // fetchAsyncGetComments,
  fetchAsyncGetDetailPost,
  selectDetailPost,
} from "../post/postSlice";
import { fetchAsyncAddCart } from "../cart/cartSlice";

type PageProps = PROPS_POST & RouteComponentProps<{ id: string }>;

const Detail: React.FC<PageProps> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const [id, setId] = useState(props.match.params.id);
  const detailPost = useSelector(selectDetailPost);
  const profiles = useSelector(selectProfiles);
  const myProfile = useSelector(selectProfile);
  const history = useHistory();
  const prof = profiles.filter((prof) => {
    return prof.userProfile === detailPost.userPost;
  });

  useEffect(() => {
    const fetchBootLoader = async () => {
      const packet = { id: id };
      await dispatch(fetchAsyncGetDetailPost(packet));
      await dispatch(fetchAsyncGetProfs());
      //await dispatch(fetchAsyncGetComments());
      await dispatch(fetchAsyncGetMyProf());
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
            <Formik
              //initialValues に遅延処理で取得した値を設定したりするので、フォームの初期値を再設定
              enableReinitialize={true}
              // initialErrors={{ email: "required" }}
              initialValues={{
                cartUserPost: `${detailPost?.userPost}`,
                cartUserProfile: `${myProfile?.userProfile}`,
                post: id,
                profile: `${myProfile?.userProfile}`,
              }}
              onSubmit={async (values) => {
                if (
                  localStorage.localJWT &&
                  values.cartUserPost !== values.cartUserProfile
                ) {
                  await dispatch(fetchAsyncAddCart(values));
                  await history.push(`/cart`);
                } else {
                  await dispatch(setOpenSignIn());
                }
              }}
              // validationSchema={Yup.object().shape({
              //   // refで他の欄を参照できます！
              //   cartUserPost: Yup.string().test(sameId),
              // })}
              render={({ handleSubmit, values, isValid }) => (
                <>
                  <input
                    type="text"
                    id="cartUserPost"
                    name="userPost"
                    hidden={true}
                  />
                  <input type="text" id="post" name="post" hidden={true} />
                  <input
                    type="text"
                    id="cartUserProfile"
                    name="userProfile"
                    hidden={true}
                  />
                  <input
                    type="text"
                    id="profile"
                    name="profile"
                    hidden={true}
                  />
                  <form onSubmit={handleSubmit}>
                    <br />
                    <Button
                      type="submit"
                      variant="contained"
                      color="default"
                      disabled={
                        values.cartUserPost !== values.cartUserProfile
                          ? !isValid
                          : isValid
                      }
                    >
                      Add the cart
                    </Button>
                  </form>
                </>
              )}
            />
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
