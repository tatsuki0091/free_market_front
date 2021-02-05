import React from "react";
import { AppBar, Button, Grid } from "@material-ui/core";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import SignIn from "../user/SignIn";
import SignUp from "../user/SignUp";
import { setOpenSignIn, setOpenSignUp } from "../user/authSlice";

const Core: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  return (
    <>
      <AppBar color="default" position="static">
        <Grid container alignItems="center" justify="center">
          <Grid item xs={9} md={9} lg={9}>
            <h1>free market</h1>
          </Grid>
          <Grid item xs={3} md={3} lg={3}>
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
          </Grid>
        </Grid>
      </AppBar>
      <SignIn />
      <SignUp />
    </>
  );
};

export default Core;
