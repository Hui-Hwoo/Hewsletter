import styles from "./page.module.css";
import { Page } from "./component/home";

export default function Home() {
  return (
    <main className={styles.main}>
      <Page />
    </main>
  );
}
