import { useRef, useState } from "react";
import "../styles/signup.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
 
 

const Signup = () => {
  const userEmailRef = useRef<HTMLInputElement | null>(null);
  const userNameRef = useRef<HTMLInputElement | null>(null);
  const userPasswordRef = useRef<HTMLInputElement | null>(null);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [emailInputFocused, setEmailInputFocused] = useState(false);
  const [emailMessageFromServer, setEmailMessageFromServer] = useState(true);
  const [passwordInputFocused, setPasswordInputFocused] = useState(false);

  const navigate = useNavigate();
  const handleNameOnBlur = () => {
    if (userNameRef.current?.value) {
      const inputName = userNameRef.current.value.trim();
      const nameRegex = /^(?=.*[A-Za-z])[A-Za-z]+(?:\s[A-Za-z]+){0,4}$/;

      console.log(isValidName);

      setIsValidName(nameRegex.test(inputName));
      console.log(isValidName);
    }
  };

  const handleEmailOnBlur = () => {
    setEmailInputFocused(false);
    if (userEmailRef.current?.value) {
      const inputEmail = userEmailRef.current.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(emailRegex.test(inputEmail));
    }
  };

  const handleOnEmailFocus = () => {
    setEmailInputFocused(true);
    setIsValidEmail(true);
    setEmailMessageFromServer(true);
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
  };
  const handleNameOnFocus = () => {
    setIsValidName(true);
  };

   
  const handleOnClick = () => {
    const inputEmail = userEmailRef.current?.value;
    const inputPassword = userPasswordRef.current?.value;
    const inputName = userNameRef.current?.value;

    if (
      inputName &&
      inputEmail &&
      inputPassword &&
      isValidEmail &&
      isValidPassword &&
      isValidName
    ) {
      axios
        .post(`https://localhost:44349/signup`, {
          userName: inputName,
          userEmail: inputEmail,
          userPassword: inputPassword,
        })
        .then((response) => {
          console.log(response.data);
          if (response.data === 0) {
            setEmailMessageFromServer(false);
          } else {
            alert("Accound created ,Please Login");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Error occurred during signup:", error);
        });
    }
  };

  return (
    <>
      <div className="login-body">
        <div className="login--name">Warehouse Management System</div>
        <div className="login">
          <div className="login--underline">Sign Up</div>
          <hr />
          <div className="login--useremail">
            <div className="useremail">
              <h3> Name</h3>
            </div>
            <div className="useremail--inputbox">
              <input
                ref={userNameRef}
                onBlur={handleNameOnBlur}
                onFocus={handleNameOnFocus}
              />
            </div>
            {!isValidName && (
              <p className="error-message--signup-name" style={{ color: "red" }}>
                Enter a proper Name
              </p>
            )}
          </div>

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
              <p className="error-message--signup-email" style={{ color: "red" }}>
                Invalid email
              </p>
            )}
            {!emailMessageFromServer && !emailInputFocused && (
              <p className="error-message--signup-email" style={{ color: "red" }}>
                There is a user with that Email ,Please use differenet email.
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
              <p className="error-message-signup-password" style={{ color: "red" }}>
                Invalid password
              </p>
            )}
          </div>
          <div className="already-have-account">
            <Link  to={'/login'}>Already have account ?</Link>
          </div>
          <div className="signup-btn">
            <button onClick={handleOnClick}>Sign up</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
