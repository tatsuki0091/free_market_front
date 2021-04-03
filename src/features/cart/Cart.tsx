import React, { useEffect, useState, useContext } from "react";
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
import { fetchAsyncGetCartItems, selectCartItems } from "../cart/cartSlice";
import { CART_USER_PROFILE_ID } from "../types";

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
  const cartItems = useSelector(selectCartItems);
  const classes = useStyles();
  const history = useHistory();

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
  console.log(cartItems);
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
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Cart;
