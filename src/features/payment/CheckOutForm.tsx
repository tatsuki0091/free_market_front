import React, { useMemo } from "react";
import { Formik, Form, FieldProps } from "formik";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector, useDispatch } from "react-redux";
import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import _ from "lodash";
import styles from "./Payment.module.css";
import { FILTER_CART_ITEMS_FOR_PAYMENT } from "../types";
import Modal from "react-modal";
import { resetOpenCheckoutForm, selectopenCheckoutForm } from "./paymentSlice";
import * as Yup from "yup";

import { AppDispatch } from "../../app/store";
import useResoinsiveFontsize from "./useResponsiveFontSize";
import { Button, TextField, IconButton } from "@material-ui/core";
import {
  editFirstname,
  editLastname,
  editPostCode,
  editAddress1,
  editAddress2,
  editPhoneNumber,
  selectShippingInfo,
} from "./paymentSlice";

const Input = ({ field }: FieldProps) => {
  return (
    <>
      <input {...field} />
    </>
  );
};

const customStyles = {
  overlay: {
    backgroundColor: "#777777",
  },
  content: {
    top: "55%",
    left: "50%",

    width: 280,
    height: 350,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  },
};

const useOptions = () => {
  const fontSize = useResoinsiveFontsize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};

const CheckOutForm: React.FC<FILTER_CART_ITEMS_FOR_PAYMENT> = (props) => {
  const stripePublishKey = loadStripe(
    "pk_test_FItnYBBDWaqY0xDUFMNlVUbv00VNh6ezwc"
  );
  const openCheckoutForm = useSelector(selectopenCheckoutForm);
  const shippingInfo = useSelector(selectShippingInfo);
  const dispatch: AppDispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  return (
    <>
      <Modal
        isOpen={openCheckoutForm}
        onRequestClose={async () => {
          await dispatch(resetOpenCheckoutForm());
        }}
        style={customStyles}
      >
        <h1>ddedee</h1>
        <Formik
          //initialValues に遅延処理で取得した値を設定したりするので、フォームの初期値を再設定
          enableReinitialize={true}
          // initialErrors={{ postCode: "required" }}
          initialValues={
            (_.map(
              props.filterCartItemsForPayment,
              function (filterCartItem, index) {
                return { id: `${filterCartItem.id}` };
              }
            ),
            {
              firstName: "",
              lastName: "",
              postCode: "",
              address1: "",
              address2: "",
              phoneNumber: "",
            })
          }
          onSubmit={async (values) => {
            console.log(values);
            // window.location.reload();
          }}
          validationSchema={Yup.object().shape({
            nickName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            postCode: Yup.string().matches(
              /(?=.*[0-9])\S$/,
              "Post code must be numbers or null"
            ),
            phoneNumber: Yup.string().matches(
              /[^0-9]+$/,
              "Phone Number must be numbers"
            ),
          })}
          render={({ handleSubmit, touched, errors, handleBlur, isValid }) => (
            <Form onSubmit={handleSubmit}>
              <TextField
                placeholder="firstName"
                type="text"
                onChange={(e) => dispatch(editFirstname(e.target.value))}
              />
              <TextField
                placeholder="lastname"
                type="text"
                onChange={(e) => dispatch(editLastname(e.target.value))}
              />
              <TextField
                placeholder="postcode"
                onBlur={handleBlur}
                type="text"
                name="postCode"
                onChange={(e) => dispatch(editPostCode(e.target.value))}
              />
              {touched.postCode && errors.postCode ? (
                <div className={styles.validateFont}>{errors.postCode}</div>
              ) : null}
              <TextField
                placeholder="address1"
                type="text"
                onChange={(e) => dispatch(editAddress1(e.target.value))}
              />
              <TextField
                placeholder="address2"
                type="text"
                onChange={(e) => dispatch(editAddress2(e.target.value))}
              />
              <TextField
                placeholder="phoneNumber"
                type="text"
                name="phoneNumber"
                onChange={(e) => dispatch(editPhoneNumber(e.target.value))}
              />
              <br />
              <label>
                Card details
                <CardElement
                  options={options}
                  onReady={() => {
                    console.log("CardElement [ready]");
                  }}
                  onChange={(event) => {
                    console.log("CardElement [change]", event);
                  }}
                  onBlur={() => {
                    console.log("CardElement [blur]");
                  }}
                  onFocus={() => {
                    console.log("CardElement [focus]");
                  }}
                />
              </label>
              <div className={styles.purchase_button}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!stripe}
                >
                  Purchase
                </Button>
              </div>
            </Form>
          )}
        />
      </Modal>
    </>
    // <Formik
    //   //initialValues に遅延処理で取得した値を設定したりするので、フォームの初期値を再設定
    //   enableReinitialize={true}
    //   initialValues={_.map(props, function (filterCartItem, index) {
    //     return { id: `${props.id}` };
    //   })}
    //   onSubmit={async (values) => {
    //     // window.location.reload();
    //   }}
    //   render={({ handleSubmit, touched, errors, isValid }) => (
    //     <Elements stripe={stripePublishKey}>
    //       <Form onSubmit={handleSubmit}>
    //         <div className={styles.purchase_button}>
    //           <Button type="submit" variant="contained" color="primary">
    //             Purchase
    //           </Button>
    //         </div>
    //       </Form>
    //     </Elements>
    //   )}
    // />
  );
};

export default CheckOutForm;
