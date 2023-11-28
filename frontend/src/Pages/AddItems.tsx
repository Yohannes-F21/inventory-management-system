import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Rule } from "antd/es/form";
import { Items } from "../data/InventoryItem";
import { Suppliers } from "../data/Suppliers";
import http from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";

const { Option } = Select;

type formField = {
  name: string;
  placeholder: string;
  rules: Rule[];
};

const forms: formField[] = [
  {
    name: "productName",
    placeholder: " Item Name",
    rules: [
      {
        required: true,
        message: "Please enter a Item Name",
      },
    ],
  },
  {
    name: "image",
    placeholder: " Image URL",
    rules: [
      {
        required: true,
        message: "Please enter a Image URL",
      },
    ],
  },
  {
    name: "price",
    placeholder: "Price",
    rules: [
      {
        required: true,
        message: "Please enter the Price",
      },
    ],
  },
  {
    name: "quantityOnHand",
    placeholder: " quantityOnHand",
    rules: [
      {
        required: true,
        message: "Please enter the amount of the Item",
      },
    ],
  },

  {
    name: "description",
    placeholder: "Description",
    rules: [
      {
        required: true,
        message: "Please write some description about the Item",
      },
    ],
  },
];

const AddItems = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  // const { key } = useParams<{ key: string }>();

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const record = location.state;
  const key = record ? record.key : null;

  const fetchCategoryData = async () => {
    try {
      const response = await http.get("/catagory");

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const { data: category, isLoading } = useQuery("category", fetchCategoryData);
  if (!isLoading) {
    // console.log(category);
  }

  const fetchSupplierData = async () => {
    try {
      const response = await http.get("/supplier");

      return response.data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const { data: supplier, isLoading: isSupplierLoading } = useQuery(
    "supplier",
    fetchSupplierData
  );

  const updateSingleProductData = async (formData: Items) => {
    try {
      const response = await http.put("/product", { formData, key });

      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };

  const sendItemData = async (formData: Items) => {
    try {
      const response = await http.post("/product", formData);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };

  const addProductMutation = useMutation(sendItemData, {
    onSuccess: () => {
      queryClient.invalidateQueries("product");
    },
  });
  const updateProductMutation = useMutation(updateSingleProductData, {
    onSuccess: () => {
      queryClient.invalidateQueries("product");
    },
  });

  useEffect(() => {
    if (key) {
      setIsEditing(true);
      // const storedData = localStorage.getItem("Items");
      // let currentItems: Items[] = [];
      // if (storedData) {
      //   currentItems = JSON.parse(storedData);
      // }

      // const initialData = currentItems.find((Items) => Items.key === key);

      // const initialData = product.find((Items: any) => Items._id === key);
      // console.log(initialData);
      form.setFieldsValue(record);
      // console.log(initialData);
      console.log(form.getFieldsValue());
    } else {
      form.resetFields();
    }
  }, [form, key]);

  const onFinish = (formData: Items) => {
    if (isEditing) {
      updateProductMutation.mutate(formData);
      // updateSingleProductData(formData);
      // queryClient.invalidateQueries("product");
    } else {
      // sendItemData(formData);
      addProductMutation.mutate(formData);
      // queryClient.invalidateQueries("product");

      form.resetFields();
    }
    // } else {
    //   message.success("Items information added successfully!");
    // }
    navigate("/inventory");
  };
  return (
    <>
      <div className="mx-auto mt-10 w-3/5 px-10 py-6 rounded-2xl border border-gray-200 shadow-xl bg-white ">
        <h1 className="text-center text-2xl  font-semibold p-2">
          Items Registration
        </h1>
        <Form
          name="department_registration"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <div className="steps-content">
            <div className="steps-content-inner">
              <div className="grid grid-cols-2 gap-x-6">
                {forms.map((field) => (
                  <Form.Item
                    key={field.name}
                    name={field.name}
                    rules={field.rules}
                  >
                    <Input
                      placeholder={field.placeholder}
                      className="border-gray-300"
                      size="large"
                    />
                  </Form.Item>
                ))}

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

                <Form.Item
                  name="catagoryID"
                  rules={[
                    {
                      required: true,
                      message: "Please select the catagory",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Select Category"
                    optionFilterProp="children"
                    className="border-gray-300  rounded-lg"
                    size="large"
                  >
                    {!isLoading &&
                      category.map((cat: any) => (
                        <Option key={cat._id} value={cat._id}>
                          {cat.catagoryName}
                        </Option>
                      ))}
                  </Select>
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
              {isEditing ? "Update" : "Add"} Item
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default AddItems;
