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
import _ from "lodash";
import { useHistory, RouteComponentProps } from "react-router-dom";
import {
  fetchAsyncGetCartItems,
  selectCartItems,
  fetchAsyncDeleteCartItem,
} from "../cart/cartSlice";
import { setOpenCheckoutForm } from "../payment/paymentSlice";
import { CART_USER_PROFILE_ID, PROPS_NICKNAME } from "../types";
import styles from "./Cart.module.css";
import { Button } from "@material-ui/core";
import { Formik, Form, FieldProps } from "formik";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements } from "@stripe/react-stripe-js";
import CheckOutForm from "../payment/CheckOutForm";

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

const Input = ({ field }: FieldProps) => {
  return (
    <>
      <input {...field} />
    </>
  );
};

const Cart: React.FC<PageProps> = (props) => {
  const dispatch: AppDispatch = useDispatch();
  //const { count, setCount } = useContext(myProfContext);
  const stripePublishKey = loadStripe(
    "pk_test_FItnYBBDWaqY0xDUFMNlVUbv00VNh6ezwc"
  );

  const myProfile = useSelector(selectProfile);
  const allCartItems = useSelector(selectCartItems);
  const allCartItemsForPayment = useSelector(selectCartItems);
  const classes = useStyles();
  const history = useHistory();
  const filterCartItems = allCartItems.filter((allCartItems) => {
    return allCartItems.profile.id === myProfile.userProfile;
  });

  const filterCartItemsForPayment = allCartItemsForPayment.filter(
    (allCartItemsForPayment) => {
      return allCartItemsForPayment.profile.id === myProfile.userProfile;
    }
  );

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

  return (
    <>
      <Header />
      <>
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
              {filterCartItems.map((filterCartItem, index) => (
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
                  <TableCell align="left">
                    {filterCartItem.post.title}
                  </TableCell>
                  <TableCell align="left">
                    {filterCartItem.post.price}
                  </TableCell>
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

        <div className={(styles.core_btnModal, styles.purButton)}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              await dispatch(setOpenCheckoutForm());
            }}
          >
            Purchase
          </Button>
        </div>
        <Elements stripe={stripePublishKey}>
          <CheckOutForm filterCartItemsForPayment={filterCartItemsForPayment} />
        </Elements>

        {/* <Formik
          //initialValues に遅延処理で取得した値を設定したりするので、フォームの初期値を再設定
          enableReinitialize={true}
          initialValues={_.map(
            filterCartItems,
            function (filterCartItem, index) {
              return { id: `${filterCartItem.id}` };
            }
          )}
          onSubmit={async (values) => {
            console.log(values);
            // window.location.reload();
          }}
          render={({ handleSubmit, touched, errors, isValid }) => (
            <Elements stripe={stripePublishKey}>
              <Form onSubmit={handleSubmit}>
                <div className={styles.purchase_button}>
                  <Button type="submit" variant="contained" color="primary">
                    Purchase
                  </Button>
                </div>
              </Form>
            </Elements>
          )}
        /> */}

        {/* <div className={styles.purchase_button}>
          <Button type="submit" variant="contained" color="primary">
            Purchase
          </Button>
        </div> */}
      </>
      <br />
    </>
  );
};

export default Cart;
