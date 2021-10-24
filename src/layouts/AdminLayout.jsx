import React from "react";
import AdminContent from "../components/Admin/AdminContent";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminNav from "../components/Admin/AdminNav";

const AdminLayout = (props) => {
  return (
    <div className="h-100 bg-gradient">
      <div>
        <AdminNav {...props} />
        <AdminHeader {...props} />
        <AdminContent {...props} />
      </div>
    </div>
  );
};

export default AdminLayout;
