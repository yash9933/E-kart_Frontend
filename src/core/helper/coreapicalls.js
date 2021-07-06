import { API } from "../../backend";

export const getProducts = () => {
    return fetch(`${API}/products`, {
        method: "GET"   
    }).then((resp) => { console.log(resp);return resp.json();})
        .catch(err => {
            console.log(err);
    })
}