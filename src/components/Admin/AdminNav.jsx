import {
  ProSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  Menu,
  SubMenu,
  MenuItem,
} from "react-pro-sidebar";
import "../../assets/admin/scss/custom.scss";
import {
  FaSignOutAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
} from "react-icons/fa";
import { AiFillDashboard, AiOutlineLineChart } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import { SiWebmoney } from "react-icons/si";
import { GiMoneyStack } from "react-icons/gi";
import { Link, useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { useEffect } from "react";

const AdminNav = (props) => {
  let history = useHistory();

  const logout = () => {
    localStorage.removeItem("token");
    props.setUser([]);
    history.push("/login");
  };

  const checkAuth = async () => {
    if (props.user.length !== 0) {
      if (props.user.admin === false || !props.user.admin) {
        history.push("/404");
      }
    } else {
      history.push("/login");
    }
  };

  useEffect(() => {
    if (props.user.length !== 0) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user]);

  useEffect(() => {
    props.getUser();
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProSidebar style={{ position: "fixed" }}>
      <SidebarHeader>
        <div className="title">
          <SiWebmoney />
          <Link to="/">shopoly</Link>
        </div>
        <div className="text-center mb-3">
          <Link to="/profile" data-tip="Profile">
            <img
              className="rounded-circle hover-shadow border"
              src={props.user.imageURL}
              alt=""
              height={100}
              width={100}
            />
          </Link>
          <ReactTooltip place="right" type="light" effect="solid" />
          <div className="fs-4 mt-2">{props.user.fullname}</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem icon={<AiFillDashboard size={20} />}>
            Dashboard
            <Link to="/admin" />
          </MenuItem>
        </Menu>
        <Menu iconShape="circle" innerSubMenuArrows={true}>
          <SubMenu title="Management" icon={<FaClipboardList size={20} />}>
            <MenuItem icon={<FaUsers />}>
              Users
              <Link to="/admin/user" />
            </MenuItem>
            <MenuItem icon={<FaBoxOpen />}>
              Products
              <Link to="/admin/product" />
            </MenuItem>
            <MenuItem icon={<BsBoxSeam />}>
              Items
              <Link to="/admin/product/item" />
            </MenuItem>
            <MenuItem icon={<FaClipboardList />}>
              Orders
              <Link to="/admin/order" />
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu title="Statistics" icon={<AiOutlineLineChart size={20} />}>
            <MenuItem>Sales</MenuItem>
            <MenuItem icon={<GiMoneyStack size={20} />}>
              Money
              <Link to="/admin/statistic/money" />
            </MenuItem>
          </SubMenu>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <div className="title">
          <button onClick={() => logout()} className="btn footer-btn">
            <FaSignOutAlt />
            <span className="text">Signout</span>
          </button>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default AdminNav;
