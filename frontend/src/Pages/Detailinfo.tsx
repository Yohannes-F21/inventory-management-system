import { Card, Statistic } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Items } from "../data/InventoryItem";
import { Button, Modal } from "antd";

const { Meta } = Card;

const Detailinfo = () => {
  const { key } = useParams<{ key: string }>();
  console.log(key);

  const storedData = localStorage.getItem("Items");
  let currentItems: Items[] = [];
  if (storedData) {
    currentItems = JSON.parse(storedData);
  }

  const initialData = currentItems.find((Items) => Items.key === key);
  console.log(initialData!.description);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Detail Items"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src={initialData?.imageUrl} />}
          actions={[
            <h3>
              Price: {initialData?.price}
              <span>
                <DollarCircleOutlined />
              </span>
            </h3>,
          ]}
        >
          <Meta
            title={initialData?.name}
            //   description={initialData?.description}
          />
          <p>{initialData!.description}</p>
        </Card>
      </Modal>
    </div>
  );
};
export default Detailinfo;
