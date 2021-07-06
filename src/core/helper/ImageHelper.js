import React from 'react';
import { API } from "../../backend";
const ImageHelper = ({ product }) => {
    const imgurl= product? `${API}/product/photo/${product._id}`:"https://images.pexels.com/photos/7775641/pexels-photo-7775641.jpeg?cs=srgb&dl=pexels-hitesh-choudhary-7775641.jpg&fm=jpg"
    return (
     
        <div className="rounded border border-success p-2">
        <img
          src={imgurl}
          alt="photo"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
          className="mb-3 rounded"
        />
      </div>
    )
}
export default ImageHelper;
