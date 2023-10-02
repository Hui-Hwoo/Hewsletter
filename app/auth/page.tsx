"use client";
import React, { useEffect, useState } from "react";
import { SignIn, SignUp } from "@/app/firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./style.module.css";
import {
  ToggleLeft,
  ToggleRight,
  At,
  Fingerprint,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { IconButton } from "../component/button";
import { useAuthStore } from "../store/auth";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const authStore = useAuthStore();

  useEffect(() => {
    setDisabled(email.length === 0 || password.length === 0);
  }, [email, password]);

  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (isSignIn) {
      const { result, error } = await SignIn(email, password);
      if (error) {
        return console.log("Error when signin:", error);
      }
      if (result && result.user) {
        authStore.login(result.user.email || "", result.user.uid);
      }
    } else {
      const { result, error } = await SignUp(email, password);
      if (error) {
        return console.log("Error when signup:", error);
      }
      if (result && result.user) {
        authStore.login(result.user.email || "", result.user.uid);
      }
    }

    return router.push("/");
  };

  const changeStatus = () => {
    setIsSignIn(!isSignIn);
  };

  const color = isSignIn ? "#2775b6" : "#1a6840";

  return (
    <div className={styles["auth-container"]} style={{ borderColor: color }}>
      <div>
        <div className={styles["title"]}>
          <div
            className={styles["title-signin"]}
            style={{ color: isSignIn ? "#2775b6" : "#b2bbbe" }}
          >
            Sign In
          </div>
          <div className={styles["title-switch"]}>
            <IconButton
              icon={
                isSignIn ? (
                  <ToggleLeft size={32} weight="fill" color={"#2775b6"} />
                ) : (
                  <ToggleRight size={32} weight="fill" color={"#1a6840"} />
                )
              }
              onClick={changeStatus}
            ></IconButton>
          </div>
          <div
            className={styles["title-signup"]}
            style={{ color: isSignIn ? "#b2bbbe" : "#1a6840" }}
          >
            Sign Up
          </div>
        </div>
        <div className={styles["auth-form"]}>
          <div style={{ color: color, fontWeight: "bold" }}>Email:</div>
          <div className={styles["auth-input"]}>
            <div className={styles["input-icon"]}>
              <At size={16} weight="bold" color={color} />
            </div>
            <input
              className={styles["input-value"]}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              style={{ borderColor: color }}
            />
          </div>

          <div style={{ color: color, fontWeight: "bold", marginTop: "10px" }}>
            Passworrd:
          </div>
          <div className={styles["auth-input"]}>
            <div className={styles["input-icon"]}>
              <Fingerprint size={16} weight="bold" color={color} />
            </div>
            <input
              className={styles["input-value"]}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              style={{ borderColor: color }}
            />
          </div>
          <div className={styles["auth-submit"]}></div>
        </div>

        <div className={styles["auth-submit"]} onClick={handleForm}>
          <div
            className={styles["sumbit-button"]}
            style={{
              backgroundColor: disabled ? "transparent" : color,
              borderColor: disabled ? "#cdd1d3" : color,
              color: disabled ? "#cdd1d3" : "white",
            }}
          >
            {isSignIn ? "SignIn" : "SignUp"}
          </div>

          <div className={styles["submit-icon"]}>
            <PaperPlaneTilt
              size={16}
              mirrored
              weight="fill"
              color={disabled ? "#cdd1d3" : color}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
