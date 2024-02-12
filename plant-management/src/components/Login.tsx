import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useRef, useState } from "react";
import axios from "axios";

const Login = () => {
  const [isValidEmail, setIsValidEmail] = useState(true);
  const userEmailRef = useRef<HTMLInputElement | null>(null);
  const userPasswordRef = useRef<HTMLInputElement | null>(null);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const [emailMessageFromServer, setEmailMessageFromServer] = useState(true);
  const [passwordMessageFromServer, setPasswordMessageFromServer] =
    useState(true);
  const [emailInputFocused, setEmailInputFocused] = useState(false);
  const [passwordInputFocused, setPasswordInputFocused] = useState(false);

  const navigate = useNavigate();

  const handleEmailOnBlur = () => {
    setEmailInputFocused(false);
    if (userEmailRef.current?.value) {
      const inputEmail = userEmailRef.current.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(emailRegex.test(inputEmail));
    }
  };

  const handlePasswordOnBlur = () => {
    setPasswordInputFocused(false);
    if (userPasswordRef.current?.value) {
      const inputPassword = userPasswordRef.current.value;
      const passwordRegex =
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

      setIsValidPassword(passwordRegex.test(inputPassword));
    }
  };

  const handleOnPasswordFocus = () => {
    setPasswordInputFocused(true);
    setIsValidPassword(true);
    setPasswordMessageFromServer(true);
  };

  const handleOnEmailFocus = () => {
    setEmailInputFocused(true);
    setIsValidEmail(true);
    setEmailMessageFromServer(true);
  };

  const handleOnClick = () => {
    const inputEmail = userEmailRef.current?.value;
    const inputPassword = userPasswordRef.current?.value;

    if (inputEmail && inputPassword && isValidEmail && isValidPassword) {
      axios
        .post(`https://localhost:44349/login`, {
          userEmail: inputEmail,
          userPassword: inputPassword,
        })
        .then((response) => {
          console.log(response.data);

          if (response.data === "INCORRECT EMAIL") {
            setEmailMessageFromServer(false);
          } else if (response.data === "INCORRECT PASSWORD") {
            setPasswordMessageFromServer(false);
          } else if (response.data === "USER FOUND") {
            alert("Login sucessful");
            navigate("/plants");
            
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      <div className="login-body">
        <div className="login--name">Warehouse Management System</div>

        <div className="login">
          <div className="login--underline">Login</div>

          <hr />
          <div className="login--useremail">
            <div className="useremail">
              <h3> Email</h3>
            </div>
            <div className="useremail--inputbox">
              <input
                type="email"
                ref={userEmailRef}
                onBlur={handleEmailOnBlur}
                onFocus={handleOnEmailFocus}
              />
            </div>
            {!isValidEmail && !emailInputFocused && (
              <p className="error-message-login" style={{ color: "red" }}>
                Invalid email
              </p>
            )}
            {!emailMessageFromServer && !emailInputFocused && (
              <p className="error-message-login" style={{ color: "red" }}>
                Couldn't find Email.
              </p>
            )}
          </div>
          <div className="login--useremail">
            <div className="useremail">
              <h3> Password</h3>
            </div>
            <div className="useremail--inputbox">
              <input
                type="password"
                ref={userPasswordRef}
                onBlur={handlePasswordOnBlur}
                onFocus={handleOnPasswordFocus}
              />
            </div>
            {!isValidPassword && !passwordInputFocused && (
              <p
                className="error-message--possword--login"
                style={{ color: "red" }}
              >
                Invalid password
              </p>
            )}
            {!passwordMessageFromServer && !passwordInputFocused && (
              <p
                className="error-message--possword--login"
                style={{ color: "red" }}
              >
                Incorrect password.
              </p>
            )}
          </div>
          <div className="account-signup">
            <Link to="/signup">don't have an account? Signup</Link>
          </div>
          <div className="forgot-password">
            <Link to="/forgotpassword">forgot password?</Link>
          </div>
          <div className="login-btn">
            <button onClick={handleOnClick}>Login</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
