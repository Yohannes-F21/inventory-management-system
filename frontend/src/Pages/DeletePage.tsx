import React, { useState } from "react";
import { Modal, message } from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Items } from "../data/InventoryItem";
import { Suppliers } from "../data/Suppliers";
import { Orders } from "../data/Orders";

const DeletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { key } = useParams<{ key: string }>();
  const [isModalOpen] = useState(true);

  const handleOk = () => {
    handleDelete();
    message.success("Entry Successfully Removed");
  };

  const handleCancel = () => {
    navigate("..");
  };

  const handleDelete = () => {
    if (key) {
      const path = location.pathname.split("/");
      path.pop();
      if (path.includes("inventory")) {
        const storedData = localStorage.getItem("Items");
        let currentItems: Items[] = [];
        if (storedData) {
          currentItems = JSON.parse(storedData);
        }
        const newItems = currentItems.filter((item) => {
          return item.key != key;
        });
        localStorage.setItem("Items", JSON.stringify(newItems));
        navigate("/inventory");
      } else if (path.includes("supplier")) {
        const storedData = localStorage.getItem("Suppliers");
        let currentSupplier: Suppliers[] = [];
        if (storedData) {
          currentSupplier = JSON.parse(storedData);
        }
        const newSupplier = currentSupplier.filter((supplier) => {
          return supplier.key != key;
        });
        localStorage.setItem("Suppliers", JSON.stringify(newSupplier));
        navigate("/supplier");
      } else if (path.includes("order")) {
        const storedData = localStorage.getItem("Orders");
        let currentSupplier: Orders[] = [];
        if (storedData) {
          currentSupplier = JSON.parse(storedData);
        }
        const newSupplier = currentSupplier.filter((supplier) => {
          return supplier.key != key;
        });
        localStorage.setItem("Orders", JSON.stringify(newSupplier));
        navigate("/orders");
      }
    }
  };

  return (
    <>
      <Modal
        title="Warning"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="No"
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to remove this entry?</p>
      </Modal>
    </>
  );
};

export default DeletePage;
