import React, { useEffect } from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import SignIn from "../user/SignIn";
import SignUp from "../user/SignUp";
import EditProfile from "./EditProfile";
import NewPost from "./NewPost";
import { Button, AppBar, Grid, Avatar, Badge } from "@material-ui/core";
import styles from "./Core.module.css";
import { MdAddAPhoto } from "react-icons/md";
import { withStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import {
  selectPosts,
  resetOpenNewPost,
  setOpenNewPost,
} from "../post/postSlice";
import {
  setOpenSignIn,
  setOpenSignUp,
  resetOpenProfile,
  setOpenProfile,
  selectProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
} from "../user/authSlice";

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

const Header: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const profile = useSelector(selectProfile);
  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
      }
    };

    fetchBootLoader();
  }, [dispatch]);
  return (
    <>
      <AppBar color="default" position="static">
        <Grid container alignItems="center" justify="center">
          <Grid item xs={4} md={4} lg={4}>
            <h1 className={styles.core_title}>
              <Link to={"/"}>free market</Link>
            </h1>
          </Grid>
          {localStorage.localJWT ? (
            <>
              <Grid item xs={4} md={4} lg={4}>
                <div>
                  <button
                    className={styles.core_post_button}
                    onClick={() => {
                      dispatch(setOpenNewPost());
                      dispatch(resetOpenProfile());
                    }}
                  >
                    <MdAddAPhoto />
                  </button>
                </div>
              </Grid>
              <Grid item xs={4} md={4} lg={4}>
                <div>
                  <button
                    className={styles.core_btnModal}
                    onClick={() => {
                      dispatch(setOpenProfile());
                      dispatch(resetOpenNewPost());
                    }}
                  >
                    <StyledBadge
                      overlap="circle"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                    >
                      <Avatar alt="who?" src={profile.img} />{" "}
                    </StyledBadge>
                  </button>
                </div>
              </Grid>
            </>
          ) : (
            <Grid item xs={8} md={8} lg={8}>
              <div className={styles.core_btnModal}>
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
              </div>
            </Grid>
          )}
        </Grid>
      </AppBar>
      <SignIn />
      <SignUp />
      <EditProfile />
      <NewPost />
    </>
  );
};

export default Header;
