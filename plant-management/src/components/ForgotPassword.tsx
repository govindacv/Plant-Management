import { useState } from "react";
import "../styles/ForgotPassword.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
    const[isValidEmail,setIsValidEmail]=useState(true)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://localhost:44380/isValidEmail?userEmail=${encodeURIComponent(
          email
        )}`
      );
      console.log(response.data);

      if ((response.data == 1)) {
        navigate("/enterotp", { state: { email } });
      }
      else
      {
        setIsValidEmail(false)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleOnClikcExit=()=>{
    navigate('/login');
  }

  return (
    <>
      <div className="forgot-password-page">
      <i className="fa-solid fa-x forgot-password-exit" onClick={handleOnClikcExit}></i>
        <div className="forgot-password-page-container">
          <div className="forgot-password-page-container-name">Enter email</div>
          <div className="forgot-password-page-container-input">
            <input type="email" value={email} onChange={handleEmailChange}  onFocus={(e)=>setIsValidEmail(true)}/>
            {!isValidEmail && (<p className="forgot-password-page-container-input-error-message">Invalid Email</p> )}
          </div>

          <div className="forgot-password-page-container-button">
            <button onClick={handleSubmit} type="submit">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
