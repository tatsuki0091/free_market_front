import React, { useEffect } from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import SignIn from "../user/SignIn";
import SignUp from "../user/SignUp";
import Post from "../post/Post";
import styles from "./Core.module.css";
import {
  setOpenSignIn,
  setOpenSignUp,
  resetOpenProfile,
} from "../user/authSlice";
import { withStyles } from "@material-ui/core/styles";
import { PROPS_PROFILE } from "../types";

import { fetchAsyncGetProfs } from "../user/authSlice";
import {
  selectPosts,
  fetchAsyncGetPosts,
  resetOpenNewPost,
} from "../post/postSlice";
import {
  Button,
  AppBar,
  Grid,
  Avatar,
  Badge,
  CircularProgress,
} from "@material-ui/core";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector(selectPosts);
  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetPosts());
      await dispatch(fetchAsyncGetProfs());
    };
    fetchBootLoader();
  }, [dispatch]);
  return (
    <>
      <AppBar color="default" position="static">
        <Grid container alignItems="center" justify="center">
          <Grid item xs={9} md={9} lg={9}>
            <h1>free market</h1>
          </Grid>
          <Grid item xs={3} md={3} lg={3}>
            {localStorage.localJWT ? (
              <Button
                variant="contained"
                color="default"
                onClick={async () => {
                  console.log("dd");
                  localStorage.removeItem("localJWT");
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  // ページを更新
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="default"
                  onClick={async () => {
                    await dispatch(setOpenSignIn());
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  color="default"
                  onClick={async () => {
                    await dispatch(setOpenSignUp());
                  }}
                >
                  Sign UP
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </AppBar>
      <SignIn />
      <SignUp />
      <>
        <div className={styles.core_posts}>
          <Grid container spacing={4}>
            {posts
              .slice(0)
              .reverse()
              .map((post) => (
                <Grid key={post.id} item xs={12} md={4}>
                  <Post
                    postId={post.id}
                    title={post.title}
                    userPost={post.userPost}
                    imageUrl={post.img}
                    liked={post.liked}
                  />
                </Grid>
              ))}
          </Grid>
        </div>
      </>
    </>
  );
};

export default Core;
