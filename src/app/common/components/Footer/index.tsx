import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <small>
        &copy; {new Date().getFullYear()} Brand Name. All rights reserved.
      </small>
    </footer>
  );
};

export default Footer;
