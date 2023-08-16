import React from "react";
import styles from "./Details.module.css";
export function Details() {
  return (
    <div className={styles.companyCard}>
      <img
        src="path_to_logo.jpg"
        alt="Company Logo"
        className={styles.companyAvatar}
      />
      <div className={styles.companytitle}>Company Name</div>
      <div className={styles.companyDetails}>
        <div className={styles.detail}>
          <strong>CEO:</strong> John Doe
        </div>
        <div className={styles.detail}>
          <strong>Founded:</strong> 2005
        </div>
        <div className={styles.detail}>
          <strong>Industry:</strong> Tech
        </div>
        <div className={styles.detail}>
          <strong>Website:</strong> www.company.com
        </div>
      </div>
    </div>
  );
}
