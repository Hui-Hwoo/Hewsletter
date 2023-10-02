import styles from "./home.module.scss";
import { useNewsStore } from "../store/news";
import { useAuthStore } from "../store/auth";
import { useState } from "react";
import dynamic from "next/dynamic";
import { CircleNotch } from "@phosphor-icons/react";

const Markdown = dynamic(async () => (await import("./markdown")).Markdown, {
  loading: () => <CircleNotch size={16} />,
});

export const EmailPart = (props: { topic: string; isLoading: boolean }) => {
  const authStore = useAuthStore();
  const { isLoading } = props;
  const newsStore = useNewsStore();

  const [to, setTo] = useState<string>(authStore.email);
  const [subject, setSubject] = useState<string>(props.topic);

  const color = "#2775b6";

  return (
    <div className={styles["email"]}>
      <div className={styles["email-input"]}>
        <div style={{ color: color, fontWeight: "bold", marginRight: "10px" }}>
          Subject:
        </div>
        <input
          className={styles["input-value"]}
          onChange={(e) => {
            setSubject(e.target.value);
          }}
          placeholder={subject}
          required
          type="text"
          id="to"
          style={{ borderColor: color }}
        />
      </div>
      <div className={styles["email-input"]}>
        <div style={{ color: color, fontWeight: "bold", marginRight: "10px" }}>
          To:
        </div>
        <input
          className={styles["input-value"]}
          onChange={(e) => {
            setTo(e.target.value);
          }}
          placeholder={to}
          required
          type="text"
          id="to"
          style={{ borderColor: color }}
        />
      </div>
      <div className={styles["email-body"]}>
        <Markdown content={newsStore.body} loading={isLoading && newsStore.body.length === 0} />
      </div>
    </div>
  );
};
