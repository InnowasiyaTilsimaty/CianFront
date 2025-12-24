"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { aptmentApi } from "@/lib/api/aptment";
import { getUserId } from "@/lib/authToken/authToken";

const { TextArea } = Input;

const AddListingModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [addAptment, { isLoading }] = aptmentApi.useAddAptmentMutation();
  const { data: paramsData, isLoading: isLoadingParams } =
    aptmentApi.useGetAptmentParamsQuery();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    try {
      const userId = getUserId();
      if (!userId) {
        message.error("User not authorized");
        return;
      }
  
      const formData = new FormData();
  
      // text fields
      Object.entries({
        title: values.title,
        description: values.description,
        count_rooms: values.count_rooms,
        floor_number: values.floor_number,
        square_footage: values.square_footage,
        price: values.price,
        latitude: values.latitude,
        longitude: values.longitude,
        region: values.region,
        type: values.type,
        service_type: values.service_type,
        status: values.status || "active",
        user: userId,
      }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
  
      // ✅ images (THIS is the key part)
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("property_images", file.originFileObj);
        }
      });
  
      await addAptment(formData).unwrap();
  
      message.success("Listing added");
      form.resetFields();
      setFileList([]);
      onClose();
    } catch (err) {
      message.error(
        err?.data?.detail ||
        err?.data?.message ||
        "Failed to add listing"
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };





  // Обработка данных для регионов, типов и типов услуг
  const regions = paramsData?.property_regions || [];
  const types = paramsData?.property_types || [];
  const serviceTypes = paramsData?.property_service_types || [];

  // Функция для получения опций Select
  const getSelectOptions = (items) => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((item) => {
      // Если элемент - объект с id и title
      if (typeof item === "object" && item !== null) {
        return {
          value: item.id,
          label: item.title || String(item.id),
        };
      }
      // Если элемент - примитив (число или строка)
      return {
        value: item,
        label: String(item),
      };
    });
  };

  const regionOptions = getSelectOptions(regions);
  const typeOptions = getSelectOptions(types);
  const serviceTypeOptions = getSelectOptions(serviceTypes);

  return (
    <Modal
      title="Добавить объявление"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: "active",
        }}
      >
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input placeholder="Название объявления" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
          rules={[{ required: true, message: "Введите описание" }]}
        >
          <TextArea rows={4} placeholder="Описание объявления" />
        </Form.Item>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item
            name="count_rooms"
            label="Количество комнат"
            rules={[{ required: true, message: "Укажите количество комнат" }]}
          >
            <InputNumber
              min={1}
              max={10}
              style={{ width: "100%" }}
              placeholder="Количество комнат"
            />
          </Form.Item>

          <Form.Item
            name="floor_number"
            label="Этаж"
            rules={[{ required: true, message: "Укажите этаж" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Этаж" />
          </Form.Item>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item
            name="square_footage"
            label="Площадь (м²)"
            rules={[{ required: true, message: "Укажите площадь" }]}
          >
            <Input placeholder="Площадь" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true, message: "Укажите цену" }]}
          >
            <Input placeholder="Цена" />
          </Form.Item>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item
            name="latitude"
            label="Широта"
            rules={[{ required: true, message: "Укажите широту" }]}
          >
            <Input placeholder="Широта" />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="Долгота"
            rules={[{ required: true, message: "Укажите долготу" }]}
          >
            <Input placeholder="Долгота" />
          </Form.Item>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item
            name="region"
            label="Регион"
            rules={[{ required: true, message: "Выберите регион" }]}
          >
            <Select
              placeholder="Выберите регион"
              loading={isLoadingParams}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {regionOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Тип"
            rules={[{ required: true, message: "Выберите тип" }]}
          >
            <Select
              placeholder="Выберите тип"
              loading={isLoadingParams}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {typeOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="service_type"
          label="Тип услуги"
          rules={[{ required: true, message: "Выберите тип услуги" }]}
        >
          <Select
            placeholder="Выберите тип услуги"
            loading={isLoadingParams}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {serviceTypeOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Статус">
          <Select placeholder="Выберите статус">
            <Select.Option value="active">Активное</Select.Option>
            <Select.Option value="inactive">Неактивное</Select.Option>
            <Select.Option value="pending">На модерации</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="post_images"
          label="Изображения"
          tooltip="Выберите изображения или введите ID через запятую (необязательно)"
        >
          <div>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false} // ⛔ prevent auto upload
              multiple
              accept="image/*"
            >
              {fileList.length >= 10 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <div style={{ marginTop: 16 }}>
              <Input
                placeholder="Или введите ID изображений через запятую (1, 2, 3...)"
                onChange={(e) => {
                  // Обновляем значение формы при вводе ID вручную, только если есть значение
                  const value = e.target.value.trim();
                  form.setFieldsValue({ post_images: value || undefined });
                }}
              />
            </div>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <Button onClick={handleCancel}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Добавить
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddListingModal.displayName = "AddListingModal";

export default AddListingModal;
