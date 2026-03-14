import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "./Auth.css";

const Register = () => {

const navigate = useNavigate();

const [form,setForm] = useState({
name:"",
email:"",
password:""
});

const [error,setError] = useState("");
const [success,setSuccess] = useState("");

const handleChange = (e) => {

setForm({
...form,
[e.target.name]:e.target.value
});

};

const handleSubmit = async (e) => {

e.preventDefault();

setError("");
setSuccess("");

try{

await API.post("/api/auth/register",form);

setSuccess("Registration successful! Redirecting...");

setTimeout(()=>{

navigate("/");

},1500);

}catch(err){

setError("Registration failed");

}

};

return(

<div className="auth-container">

<div className="auth-card">

<h2>Create Account</h2>

<p className="subtitle">Register to get started</p>

{error && <p className="error">{error}</p>}
{success && <p className="success">{success}</p>}

<form onSubmit={handleSubmit}>

<div className="input-group">

<label>Name</label>

<input
type="text"
name="name"
placeholder="Enter your name"
value={form.name}
onChange={handleChange}
required
/>

</div>

<div className="input-group">

<label>Email</label>

<input
type="email"
name="email"
placeholder="Enter email"
value={form.email}
onChange={handleChange}
required
/>

</div>

<div className="input-group">

<label>Password</label>

<input
type="password"
name="password"
placeholder="Create password"
value={form.password}
onChange={handleChange}
required
/>

</div>

<button className="auth-btn">

Register

</button>

</form>

<p className="switch-text">

Already have an account?
<Link to="/"> Login</Link>

</p>

</div>

</div>

);

};

export default Register;