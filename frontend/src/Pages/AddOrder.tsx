import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, DatePicker } from "antd";
// import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Rule } from "antd/es/form";
// import { Suppliers } from "../data/Suppliers";
import { Orders } from "../data/Orders";
// import { Items } from "../data/InventoryItem";
import http from "../utils/http";
import dayjs, { Dayjs } from "dayjs";
import { useMutation, useQuery, useQueryClient } from "react-query";
const { Option } = Select;

type formField = {
  name: string;
  placeholder: string;
  rules: Rule[];
};

const forms: formField[] = [
  {
    name: "quantityOrdered",
    placeholder: " Quantity",
    rules: [
      {
        required: true,
        message: "Please enter the amount of Quantity",
      },
    ],
  },
  {
    name: "unitPrice",
    placeholder: "Unit Price",
    rules: [
      {
        required: true,
        message: "Please enter the price",
      },
    ],
  },
];
const AddOrder = () => {
  const [form] = Form.useForm();
  // const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  // const [formFields, setFormFields] = useState<Suppliers>({} as Suppliers);
  const location = useLocation();
  const record = location.state;
  const key = record ? record.key : null;
  const queryClient = useQueryClient();

  const fetchSupplierData = async () => {
    try {
      const response = await http.get("/supplier");
      console.log(response);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const { data: supplier, isLoading: isSupplierLoading } = useQuery(
    "supplier",
    fetchSupplierData
  );

  const fetchInventryData = async () => {
    try {
      const response = await http.get("/product");
      console.log(response);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const { data: product, isLoading: isProductLoading } = useQuery(
    "product",
    fetchInventryData
  );

  const sendOrderData = async (formData: Orders) => {
    try {
      const response = await http.post("/order", formData);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };

  const updateSingleOrderData = async (formData: any) => {
    try {
      const response = await http.put("/order", { formData, key });

      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };
  const addOrderMutation = useMutation(sendOrderData, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
  });
  const updateOrderMutation = useMutation(updateSingleOrderData, {
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
  });
  useEffect(() => {
    if (key) {
      setIsEditing(true);

      form.setFieldsValue({ ...record, deliveryDate: null });
      // console.log(form.getFieldsValue());
    } else {
      form.resetFields();
    }
  }, [form, key]);
  const onFinish = (formData: Orders) => {
    if (isEditing) {
      // updateSingleSupplierData(formData);
      updateOrderMutation.mutate(formData);
    } else {
      // sendOrderData(formData);
      addOrderMutation.mutate(formData);
      form.resetFields();
    }

    navigate("/orders");
  };
  const [returnDate, setReturnDate] = useState<string>("");
  const handleDateChange = (date: Dayjs | null) => {
    // Convert the Day.js object to a string in the desired format
    const dateString = date ? date.format("M/D/YY") : "";
    setReturnDate(dateString);
  };

  return (
    <>
      <div className="mx-auto mt-10 w-3/5 px-10 py-6 rounded-2xl border border-gray-200 shadow-xl bg-gray-50 ">
        <h1 className="text-center text-2xl  font-semibold p-2">
          Create An Order
        </h1>
        <Form
          name="order_creation"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <div className="steps-content">
            <div className="steps-content-inner">
              <div className="grid grid-cols-2 gap-x-6">
                <Form.Item
                  name="productID"
                  rules={[
                    {
                      required: true,
                      message: "Please select the Item",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Item"
                    optionFilterProp="children"
                    className="border-gray-300  rounded-lg"
                    size="large"
                  >
                    {!isProductLoading &&
                      product.map((product: any) => (
                        <Option key={product.key} value={product._id}>
                          {product.productName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="supplierID"
                  rules={[
                    {
                      required: true,
                      message: "Please select the supplier",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Supplier"
                    optionFilterProp="children"
                    className="border-gray-300  rounded-lg"
                    size="large"
                  >
                    {!isSupplierLoading &&
                      supplier.map((supplier: any) => (
                        <Option key={supplier.key} value={supplier._id}>
                          {supplier.supplierName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
                {forms.map((field) => (
                  <Form.Item
                    key={field.name}
                    name={field.name}
                    rules={field.rules}
                  >
                    <Input
                      placeholder={field.placeholder}
                      className="border-gray-300 "
                      size="large"
                    />
                  </Form.Item>
                ))}
                <Form.Item
                  name="deliveryDate"
                  rules={[
                    {
                      required: true,
                      message: "Please select the deliveryDate",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={handleDateChange}
                    value={returnDate ? dayjs(returnDate) : null}
                    placeholder="Delivery Date"
                    className="border-gray-300 border  rounded-lg w-full"
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-2/6 bg-sky-600"
            >
              {isEditing ? "Update" : "Add"} Order
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default AddOrder;
