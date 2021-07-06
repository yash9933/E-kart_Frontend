import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { isAutheticated } from '../auth/helper';
import Base from '../core/Base';
import { getCategory, updateCategory } from './helper/adminapicall';



const UpdateCategory = ({ match }) => {
    const { user, token } = isAutheticated();
    const [values, setValues] = useState({
        name: "",
        error: "",
        loading:false,
        success:false,
        
    });
    
    const { success,name,error } = values;
    const goBack = () => (
        <div className="mt-5">
            <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
                Admin Home
            </Link>
        </div>
    )
    const preload = (categoryId) => {
        getCategory(categoryId).then((data) => {
           
            if (data.error) {
                setValues({...values,error:data.error})

            }
            else {
                console.log(data);
                setValues({ ...values, name: data.name })
            }

            
        })
    }
   
    useEffect(() => {
        preload(match.params.categoryId);
        //console.log(match.params.categoryId);
    }, [])
    
    //console.log(name);
    const handleChange = name=>event => {
        //console.log(event.target.value);
        setValues({ ...values, [name]: event.target.value });
    }
    const onSubmit = (event) => {
        event.preventDefault();
        //setValues({ ...values, error: "" });
        //backend request fired
        updateCategory(match.params.categoryId,user._id, token, name)
            .then(data => {
                console.log(data);
            
                if (data.error) {
                    setValues({ ...values, error: data.error })
                    console.log(data.error);
                }
                else {
                    setValues({ ...values, name:data.name,success:true });
                    
                }
                //console.log(name);
        })
    }
    const successMessage = () => {
        if (success) {
            return (
                <h4 className="text-success">
                    Category updated successfully
                </h4>);
        }
    }
    const warningMessage = () => {
        if (error) {
            return (
                <h4 className="text-warning">
                    Failed to update category
                </h4>);
        }
    }
    const myCategoryForm = () => (
        <form action="">
            <div className="form-group">
                <p className="lead">Enter the category</p>
                <input type="text" className="form-control my-3" autoFocus required placeholder="Summer"
                   
                    value={name}
                    onChange={handleChange("name")}/>
                <button className="btn btn-outline-info"
                onClick={onSubmit}>
                    Update Category
                </button>
            </div>
        </form>
        
    )
    return (
        <Base title="Create A Category Here"
            description="Add a new category for new Tshirts"
        className="container bg-info p-4">
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
     </Base>
    )
}

export default UpdateCategory;
