import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "./Auth.css";

const Login = () => {

const navigate = useNavigate();

const [form,setForm] = useState({
email:"",
password:""
});

const [error,setError] = useState("");

const handleChange = (e) => {

setForm({
...form,
[e.target.name]:e.target.value
});

};

const handleSubmit = async (e) => {

e.preventDefault();

setError("");

try{

const res = await API.post("/api/auth/login",form);

localStorage.setItem("token",res.data.token);

navigate("/dashboard");

}catch(err){

setError("Invalid email or password");

}

};

return(

<div className="auth-container">

<div className="auth-card">

<h2>Welcome Back</h2>

<p className="subtitle">Login to your account</p>

{error && <p className="error">{error}</p>}

<form onSubmit={handleSubmit}>

<div className="input-group">

<label>Email</label>

<input
type="email"
name="email"
placeholder="Enter your email"
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
placeholder="Enter password"
value={form.password}
onChange={handleChange}
required
/>

</div>

<button className="auth-btn">
Login
</button>

</form>

<p className="switch-text">

Don't have an account?
<Link to="/register"> Register</Link>

</p>

</div>

</div>

);

};

export default Login;