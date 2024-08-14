

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, firestore } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = () => {
  toast.success ("  Will take few seconds to Login in. ", {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  let errorTimeout: NodeJS.Timeout;

  useEffect(() => {
    if (error) {
      errorTimeout = setTimeout(() => {
        setError(null);
      }, 4000); // Clear error message after 5 seconds
    }

    // Clean up the timeout if the component unmounts
    return () => clearTimeout(errorTimeout);
  }, [error]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        // Retrieve user data from local storage
        const registrationData = localStorage.getItem("registrationData");
        const { profileName = "" } = registrationData
          ? JSON.parse(registrationData)
          : {};

        // Check if user data exist in firestore
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
          // Save user data to firestore after email verification
          await setDoc(doc(firestore, "users", user.uid), {
            profileName,
            email: user.email,
          });
        }
        router.push("/dashboard");
      } else {
        setError("Please verify your email address");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user data exist in firestore
      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (!userDoc.exists()) {
        // Save user data to firestore if it doesn't exist
        await setDoc(doc(firestore, "users", user.uid), {
          profileName: user.displayName || "User",
          email: user.email,
        });
      }

      // Store user data in local storage
      localStorage.setItem(
        "userData",
        JSON.stringify({
          uid: user.uid,
          profileName: user.displayName || "User",
          email: user.email,
        })
      );

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred during Google sign-in");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="form">
        <div className="form-header">
          <p className="link">
            <a href="#" onClick={() => router.push("/")}>
              <IoIosArrowRoundBack className="back-arrow" />
            </a>
          </p>
          <h1> Scissors Login</h1>
          <p className="link">
            <a href="#" onClick={() => router.push("/register")}>
              Sign Up
            </a>
          </p>
        </div>

        <div className="input-group">
          <input
            type="email"
            id="Email"
            name="Email"
            placeholder=""
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-group_input"
          />

          <label htmlFor="email" className="input-group_label">
            Email Address
          </label>
        </div>

        <div className="input-group">
          <input
            type={isVisible ? "text" : "password"}
            id="password"
            name="password"
            placeholder=""
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-group_input"
          />

          <span
            onClick={toggleVisibility}
            aria-label="toggle password visibility"
          >
            {isVisible ? (
              <AiTwotoneEyeInvisible className="text-2xl text-default-400 text-deep-purple absolute right-2 bottom-2" />
            ) : (
              <AiTwotoneEye className="text-2xl text-default-400 text-deep-purple absolute right-2 bottom-2" />
            )}
          </span>

          <label htmlFor="password" className="input-group_label">
            Password
          </label>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
         onClick={notify}
          type="submit"
          disabled={loading}
          className={` ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <ToastContainer 
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />

        <div className="or">
          <div className="dash"></div>
          <div className="continue-with">or go with</div>
          <div className="dash"></div>
        </div>
      </form>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="google-sign"
      >
        <Image
          className="google-image"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          width={20}
          height={5}
          loading="lazy"
          alt="google logo"
        />
        <span> Google</span>
      </button>
    </div>
  );
};

export default Signin;
