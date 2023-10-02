"use client";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { SignOut } from "../firebase/auth";
import styles from "./home.module.scss";
import { useNewsStore, newsResultType } from "../store/news";
import dynamic from "next/dynamic";

const EmailPart = dynamic(
  async () => (await import("../component/email")).EmailPart,
  { ssr: false },
);

const EditorPart = dynamic(
  async () => (await import("../component/editor")).EditorPart,
  { ssr: false },
);

export function Page() {
  // @ts-ignore
  const { user } = useAuthContext();
  const router = useRouter();
  const [topic, setTopic] = useState<string>("Internship");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const newsStore = useNewsStore();

  const updateTopic = (topic: string) => {
    setTopic(topic);
    newsStore.changeTopic(topic);
  };

  // React.useEffect(() => {
  //   if (user == null) router.push("/auth");
  // }, [user, router]);

  return (
    <div className={styles["container"]}>
      <EditorPart
        topic={topic}
        setTopic={updateTopic}
        setBody={newsStore.updateBody}
        setIsLoading={setIsLoading}
      />
      <EmailPart topic={topic} isLoading={isLoading} />
    </div>
  );
}
