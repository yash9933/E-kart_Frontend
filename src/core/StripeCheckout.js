import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { isAutheticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/cartHelper';
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from '../backend';
import { createOrder } from './helper/orderHelper';

const StripeCheckout = ({ products, setReload = f => f, reload = undefined }) => {
    const [data, setData] = useState({
        loading: false,
        success: false,
        error: "",
        address: "",
        
    });
    const makePayment = (token) => {
        const body = {
            token,
            products,
        }
        const headers = {
            "Content-Type": "application/json",
            
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body:JSON.stringify(body)
        }).then(response => {
            const { status } = response;
            console.log("Status", status);
            cartEmpty();
        }).catch((err) => {
            console.log(err);
        })
         
     }
    const token = isAutheticated() && isAutheticated().token;
    const userId = isAutheticated() && isAutheticated().user._id;
    const showStripButton = () => {
        return isAutheticated() ? (
            <StripeCheckoutButton
                stripeKey="pk_test_51IwOWTSJW9JfDBcNKsi8JlGrVA8uXq6dvQLtTsSuYfF2QaPbWHtcUAUjbffI8CgrGEr1de3PAszBQuKmp99xVRQA00NCvTd0lW"
                token={makePayment}
                amount={getFinalPrice() * 100}
                name="Buy Tshirt"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-info">
            Pay with Stripe
        </button></StripeCheckoutButton>
        ) : (<Link to="/signin"> <button className="btn btn-warning">Sign In</button> </Link>)
    
    }
    const getFinalPrice=()=>{
        let amount=0;
        
                 if(products !== undefined ){
                    products.map(p=>{
            amount = amount + p.price;
        });
         }
        return amount;
    };

    console.log(products);
    return (
        <div>
            <h3 className="text-white">Stripe component {getFinalPrice()} </h3>
            {showStripButton()}
        </div>
    )
}

export default StripeCheckout;
