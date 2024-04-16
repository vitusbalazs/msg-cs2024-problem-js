import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Cards.module.css";

type SidebarProps = {
  icon: React.ReactNode;
  to: string;
  text: string;
};

export default function SidebarItem({ icon, to, text }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];

  return (
    <Link
      to={`/${to}`}
      className={`${
        pathname === to ? styles.sidebarItemActive : styles.sidebarItem
      } ${styles.cursorPointer} col-10 p-2 rounded my-1 text-decoration-none`}
    >
      <div className={styles.sidebarItemTextColor}>
        {icon} {text}
      </div>
    </Link>
  );
}
