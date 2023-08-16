import React from "react";
import styles from "./Searchbar.module.css";
export function Searchbar() {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchField}>
        <span className={styles.searchLabel}>What</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Job title or company name"
        />
      </div>
      <div className={styles.searchField}>
        <span className={styles.searchLabel}>Where</span>
        <input type="text" className={styles.searchInput} placeholder="City" />
      </div>
      <button className={styles.searchButton}>Search</button>
    </div>
  );
}
