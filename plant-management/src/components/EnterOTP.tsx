import axios from "axios";
import   { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EnterOTP = () => {
  const location = useLocation();
  const email = location.state;
  const [userEmail, _setUserEmail] = useState(email);
  const [otp, setOtp] = useState(0);
  const navigate = useNavigate();
  const [inputOtp, setInputOtp] = useState();
  const[isValidOTP,setIsValidOTP]=useState(true)
  useEffect(() => {
    console.log(userEmail);
    axios
      .get(`https://localhost:44380/sendotp?email=${userEmail.email}`)
      .then((response) => {
        console.log(response.data);
        axios.get(`https://localhost:44380/getotp?userEmail=${userEmail.email}`).then((response)=>{
          console.log(response.data);
          setOtp(response.data);
          
        })
      });
  }, []);

  const handleOnClick = () => {
    console.log(otp);
    console.log(inputOtp);

    if (otp == inputOtp) {
      navigate("/changepassword", { state: { userEmail } });
    } else {
        setIsValidOTP(false)
    }
  };

  const handleInputChange = (e: any) => {
    setInputOtp(e.target.value);
  };
  
  const handleOnClikcExit=()=>{
    navigate('/login');
  }
  return (
    <>
      <div className="forgot-password-page">
      <i className="fa-solid fa-x forgot-password-exit" onClick={handleOnClikcExit}></i>

        <div className="forgot-password-page-container">
          <div className="forgot-password-page-container-name">Enter OTP</div>
          <div className="forgot-password-page-container-input">
             
            <input type="text" value={inputOtp} onChange={handleInputChange}  onFocus={()=>setIsValidOTP(true)} />
            {!isValidOTP && (<p className="forgot-password-page-container-input-error-message">Invalid OTP</p> )}

          </div>

          <div className="forgot-password-page-container-button">
            <button onClick={handleOnClick} type="submit">
             Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnterOTP;
