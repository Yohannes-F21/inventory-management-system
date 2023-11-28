import { useState, useEffect } from "react";
import { Form, Input, Button, message, Card } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Rule } from "antd/es/form";
import { Suppliers } from "../data/Suppliers";
import http from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";

type formField = {
  name: string;
  placeholder: string;
  rules: Rule[];
};

const forms: formField[] = [
  {
    name: "supplierName",
    placeholder: " Supplier Name",
    rules: [
      {
        required: true,
        message: "Please enter a Supplier Name",
      },
    ],
  },
  {
    name: "email",
    placeholder: "Email",
    rules: [
      {
        required: true,
        type: "email",
        message: "Please enter a valid email address",
      },
    ],
  },

  {
    name: "address",
    placeholder: "Address",
    rules: [
      {
        required: true,
        message: "Please enter the Address",
      },
    ],
  },
  {
    name: "phone",
    placeholder: " Phone Number",
    rules: [
      {
        required: true,
        message: "Please enter phone number",
      },
    ],
  },
];
const AddSupplier = () => {
  const [form] = Form.useForm();
  // const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const record = location.state;
  const key = record ? record.key : null;
  console.log(record);

  const queryClient = useQueryClient();

  const updateSingleSupplierData = async (formData: any) => {
    try {
      const response = await http.put("/supplier", { formData, key });

      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };
  const sendSupplierData = async (formData: any) => {
    try {
      const response = await http.post("/supplier", formData);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };
  const addSupplierMutation = useMutation(sendSupplierData, {
    onSuccess: () => {
      queryClient.invalidateQueries("supplier");
    },
  });
  const updateSupplierMutation = useMutation(updateSingleSupplierData, {
    onSuccess: () => {
      queryClient.invalidateQueries("supplier");
    },
  });

  useEffect(() => {
    if (key) {
      setIsEditing(true);

      form.setFieldsValue(record);
      // console.log(form.getFieldsValue());
    } else {
      form.resetFields();
    }
  }, [form, key]);
  const onFinish = (formData: any) => {
    if (isEditing) {
      // updateSingleSupplierData(formData);
      updateSupplierMutation.mutate(formData);
      form.resetFields();
      setIsEditing(false);
    } else {
      // sendSupplierData(formData);
      addSupplierMutation.mutate(formData);
      form.resetFields();
    }

    navigate("/suppliers");
  };

  return (
    <>
      <div className="mx-auto mt-10 w-3/5 px-10 py-6 rounded-2xl border border-gray-200 shadow-xl bg-white ">
        <h1 className="text-center text-2xl  font-semibold p-2">
          Suppliers Registration
        </h1>
        <Form
          name="supplier_registration"
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
                      className="border-gray-300 "
                      size="large"
                    />
                  </Form.Item>
                ))}
              </div>
            </div>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-2/6 bg-sky-600 "
            >
              {isEditing ? "Update" : "Add"} Supplier
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default AddSupplier;
