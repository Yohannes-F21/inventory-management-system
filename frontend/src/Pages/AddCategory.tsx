import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useParams, useNavigate } from "react-router-dom";
import { Rule } from "antd/es/form";
import { Suppliers } from "../data/Suppliers";
import http from "../utils/http";
import { useMutation, useQueryClient } from "react-query";

type formField = {
  name: string;
  placeholder: string;
  rules: Rule[];
};

const forms: formField[] = [
  {
    name: "catagoryName",
    placeholder: " Category Name",
    rules: [
      {
        required: true,
        message: "Please enter the Category Name",
      },
    ],
  },
  {
    name: "description",
    placeholder: "Description",
    rules: [
      {
        required: true,
        message: "Please enter the Description",
      },
    ],
  },
];

const AddCategory = (props: any) => {
  const record = props.record;
  const key = record ? record.key : null;
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const sendCategoryData = async (formData: Suppliers) => {
    try {
      const response = await http.post("/catagory", formData);

      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };
  const addCategoryMutation = useMutation(sendCategoryData, {
    onSuccess: () => {
      queryClient.invalidateQueries("catagory");
    },
  });
  const updateSingleCategoryData = async (formData: any) => {
    try {
      const response = await http.put("/catagory", { formData, key });

      return response.data;
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    }
  };
  const updateCategoryMutation = useMutation(updateSingleCategoryData, {
    onSuccess: () => {
      queryClient.invalidateQueries("catagory");
    },
  });
  useEffect(() => {
    if (key) {
      setIsEditing(true);
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [form, key]);
  const onFinish = (formData: any) => {
    // sendCategoryData(formData);
    if (isEditing) {
      // updateSingleSupplierData(formData);
      updateCategoryMutation.mutate(formData);
      form.resetFields();
      setIsEditing(false);
    } else {
      // sendSupplierData(formData);
      addCategoryMutation.mutate(formData);
      form.resetFields();
    }
  };

  return (
    <>
      <div className="mx-auto mt-10 w-full px-5 py-6 rounded-2xl border border-gray-200 shadow-xl bg-white ">
        <Form
          name="supplier_registration"
          onFinish={onFinish}
          layout="vertical"
          form={form}
        >
          <div className="steps-content">
            <div className="steps-content-inner">
              <div className="grid grid-cols-1 gap-x-6">
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
              {isEditing ? "Update" : "Add"} category
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default AddCategory;
