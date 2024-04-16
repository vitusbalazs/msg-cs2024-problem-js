import styles from "../styles/Cards.module.css";
import Logo from "../assets/logo.png";
import HorizontalDivider from "./HorizontalDivider";
import SidebarItem from "./SidebarItem";
import { Cash, People, Send } from "react-bootstrap-icons";

export default function Sidebar() {
  return (
    <div
      className={`${styles.card} ${styles.fullHeight} rounded me-3 py-3 px-2`}
    >
      <div className="col-12 d-flex justify-content-center">
        <img src={Logo} alt="Logo" className="col-10 my-2" />
      </div>
      <HorizontalDivider />
      <nav className="col-12 d-flex flex-column align-items-center">
        <SidebarItem icon={<People />} to="" text="Accounts" />
        <SidebarItem icon={<Send />} to="transfer" text="Transfer" />
        <SidebarItem icon={<Cash />} to="withdraw" text="Withdraw" />
      </nav>
    </div>
  );
}
