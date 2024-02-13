import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const location = useLocation();
  const email = location.state;
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(
    email ? email.userEmail.email : ""
  );

  useEffect(() => {
    console.log(userEmail);
  }, [userEmail]);

  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isValidPassword && password.trim() != "") {
      console.log("yes");

      axios
        .post(`https://localhost:44380/updatepassword`, {
          userEmail: userEmail,
          userPassword: password,
        })
        .then((response) => {
          if (response.data === 1) {
            alert("password updated, Please login");
            navigate("/login");
          }
        });
    } else {
      console.log("Invalid password");
      setIsValidPassword(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const userPasswordRef = useRef<HTMLInputElement | null>(null);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handlePasswordOnBlur = () => {
    if (userPasswordRef.current?.value) {
      const passwordRegex =
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,16}$/;

      setIsValidPassword(passwordRegex.test(password));
    }
  };

  const handleOnClikcExit = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="forgot-password-page">
        <i
          className="fa-solid fa-x forgot-password-exit"
          onClick={handleOnClikcExit}
        ></i>

        <div className="forgot-password-page-container">
          <div className="forgot-password-page-container-name">
            Enter new password
          </div>
          <div className="forgot-password-page-container-input">
            <input
              ref={userPasswordRef}
              type="password"
              value={password}
              onFocus={() => setIsValidPassword(true)}
              onBlur={handlePasswordOnBlur}
              onChange={handleInputChange}
            />
            {!isValidPassword && (
              <p className="forgot-password-page-container-input-error-message">
                Invalid password
              </p>
            )}
          </div>

          <div className="forgot-password-page-container-button">
            <button onClick={handleOnClick} type="submit">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
