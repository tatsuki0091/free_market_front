import React, { useEffect } from "react";
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Header from "../core/Header";
import { fetchAsyncGetMyProf, selectProfile } from "../user/authSlice";
import { useHistory, RouteComponentProps } from "react-router-dom";
import {
  fetchAsyncGetCartItems,
  selectCartItems,
  fetchAsyncDeleteCartItem,
} from "../cart/cartSlice";
import { CART_USER_PROFILE_ID } from "../types";
import styles from "./Cart.module.css";
import { Button } from "@material-ui/core";
import { Formik } from "formik";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

type PageProps = CART_USER_PROFILE_ID & RouteComponentProps<{ id: string }>;

const Cart: React.FC<PageProps> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  //const { count, setCount } = useContext(myProfContext);

  const myProfile = useSelector(selectProfile);
  const allCartItems = useSelector(selectCartItems);
  const classes = useStyles();
  const history = useHistory();
  const filterCartItems = allCartItems.filter((allCartItems) => {
    return allCartItems.profile.id === myProfile.userProfile;
  });
  // const cartItems = cartItems.filter((prof) => {
  //   return prof.userProfile === userPost;
  // });
  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        await dispatch(fetchAsyncGetMyProf());
        const packet = { cartUserProfile: `${myProfile.userProfile}` };
        await dispatch(fetchAsyncGetCartItems(packet));
      } else {
        // ログインしてなかったらトップ画面に遷移
        history.push("/");
      }
    };
    fetchBootLoader();
  }, [dispatch]);
  const rows = [
    createData("Frozen yoghurt", 159, 6, 24, 4),
    createData("Ice cream sandwich", 237, 9, 37, 4),
    createData("Eclair", 262, 16, 24, 6),
    createData("Cupcake", 305, 3, 67, 4),
    createData("Gingerbread", 356, 16, 49, 3),
  ];
  return (
    <>
      <Header />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Purchase date</TableCell>
              <TableCell align="left">Product image</TableCell>
              <TableCell align="left">Product name</TableCell>
              <TableCell align="left">Price</TableCell>
              <TableCell align="left">Seller</TableCell>
              <TableCell align="left">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterCartItems.map((filterCartItem) => (
              <TableRow key={filterCartItem.id}>
                <TableCell component="th" scope="row">
                  {filterCartItem.created_on.substr(0, 10)}
                </TableCell>
                <TableCell align="left">
                  <img
                    className={styles.post_image}
                    src={filterCartItem.post.img}
                    alt=""
                  />
                </TableCell>
                <TableCell align="left">{filterCartItem.post.title}</TableCell>
                <TableCell align="left">{filterCartItem.post.price}</TableCell>
                <TableCell align="left">
                  {filterCartItem.profile.nickName}
                </TableCell>
                <TableCell align="left">
                  <Formik
                    //initialValues に遅延処理で取得した値を設定したりするので、フォームの初期値を再設定
                    enableReinitialize={true}
                    // initialErrors={{ email: "required" }}
                    initialValues={{
                      id: `${filterCartItem.id}`,
                    }}
                    onSubmit={async (values) => {
                      await dispatch(fetchAsyncDeleteCartItem(values));
                      // ページをリロード
                      window.location.reload();
                    }}
                    // validationSchema={Yup.object().shape({
                    //   // refで他の欄を参照できます！
                    //   cartUserPost: Yup.string().test(sameId),
                    // })}
                    render={({ handleSubmit, values, isValid }) => (
                      <>
                        <input
                          type="text"
                          id="cartId"
                          name="cartId"
                          hidden={true}
                        />
                        <form onSubmit={handleSubmit}>
                          <br />
                          <Button
                            type="submit"
                            variant="contained"
                            color="default"
                          >
                            Delete
                          </Button>
                        </form>
                      </>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </>
  );
};

export default Cart;
