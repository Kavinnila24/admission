import React from "react";
import styles from "./Forbidden403.module.css";

const Forbidden403: React.FC = () => {
  return (
    <div className={styles.layoutContainer}>
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Access Denied</h1>
        <section className={styles.contentBody}>
          <div className={styles.forbiddenWrapper}>
            <h1 className={styles.errorCode}>403</h1>
            <h2 className={styles.errorMessage}>Forbidden</h2>
            <p className={styles.errorDescription}>
              You don’t have permission to view this page.
            </p>
            <a href="/dashboard" className={styles.backButton}>
              ⬅ Return to Dashboard
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Forbidden403;
