import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAutheticated } from '../auth/helper'
import { cartEmpty, loadCart } from './helper/cartHelper'
import { createOrder } from './helper/orderHelper'
import { getmeToken,processPayment } from './helper/paymentBHelper'
import DropIn from "braintree-web-drop-in-react"
const PaymentB = ({ products, setReload = f => f, reload = undefined }) => {
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance:{},
        
    })
    const token  = isAutheticated()&& isAutheticated().token;
    const userId = isAutheticated() && isAutheticated().user._id;
    const getToken = (userId, token) => {
        getmeToken(userId, token).then(info => {
          console.log("INFORMATION", info);
          if (info && info.error) {
            setInfo({ ...info, error: info.error });
          } else {
              if (info !== undefined) {
                  const clientToken = info.clientToken;
                  setInfo({ clientToken });
              }
          }
        });
    };
    
    const showbtDropIn = () => {
        return (
            <div>
                {info.clientToken !== null && products?.length > 0 ? (
                    <div>
                    <DropIn
                      options={{ authorization: info.clientToken }}
                      onInstance={(instance) => (info.instance = instance)}
                        />
                        <div className="d-grid gap-2">
                            <button className="btn btn-info" onClick={onPurchase}>Buy</button>
                        </div>
                  </div>
                ) : (
                        <h3>Please log in or add something to cart</h3>
                )}
            </div>
        )
    }
    useEffect(() => {
       getToken(userId,token)
    }, [])

    const onPurchase = () => {
        setInfo({ loading: true });
        let nonce=null;
        let getNonce = info?.instance?.requestPaymentMethod().then(data => {
          nonce = data?.nonce;
          const paymentData = {
            paymentMethodNonce: nonce,
            amount: getAmount()
          };
          processPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({ ...info, success: response.success, loading: false });
                        console.log("payment success");
                        const orderData = {
                            products: products,
                            transaction_id: response.transaction.id,
                            amount: response.transaction.amount,
                            

                        };
                        createOrder(userId, token, orderData);

                        cartEmpty(() => {
                            console.log("APP CRASHED")
                        });
                        setReload(!reload);
                    })
                    .catch(err => {
                        setInfo({ loading: false, success: false });
                        console.log("payment failed");
                })
            })
            .catch()
        
    }
    const getAmount = () => {
        let amount = 0;
        products?.map(product => {
            amount = amount + product.price;
        });
        return amount;
    }
    return (
        <div>
            <h3>Your Bill is ${getAmount()}</h3>
            {showbtDropIn()}
        </div>
    )
}

export default PaymentB
