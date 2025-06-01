import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUpload, FiLoader } from "react-icons/fi";

// Đổi API_URL cho đúng backend public nếu cần!
const API_URL = "http://localhost:3001/api/products";
const UPLOAD_API = "http://localhost:3001/api/upload-image";

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file chọn ảnh, preview ngay
  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setImgPreview(URL.createObjectURL(f));
    else setImgPreview("");
  };

  // Xử lý upload ảnh riêng
  const uploadImage = async () => {
    if (!file) return "";
    const data = new FormData();
    data.append("image", file);
    const res = await axios.post(UPLOAD_API, data);
    return res.data.url; // Trả về url file ảnh
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate FE
    if (!form.title || form.title.length < 3)
      return toast.error("Tên sản phẩm phải >= 3 ký tự!"), setLoading(false);
    if (!form.description)
      return toast.error("Mô tả không được trống!"), setLoading(false);
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      return toast.error("Giá phải là số dương!"), setLoading(false);
    if (!form.category)
      return toast.error("Phải chọn danh mục!"), setLoading(false);

    try {
      // Nếu có ảnh upload thì upload lấy url
      let imageUrl = form.imageUrl;
      if (file) {
        imageUrl = await uploadImage();
      }
      // Lấy token
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập!");
        setLoading(false);
        navigate("/login");
        return;
      }
      await axios.post(
        API_URL,
        { ...form, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Thêm sản phẩm thành công!");
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Có lỗi xảy ra, vui lòng thử lại hoặc đăng nhập lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Ảnh preview */}
        <div>
          <label className="block font-medium mb-2">Ảnh sản phẩm</label>
          <div className="flex items-center gap-3">
            <label className="bg-gray-200 px-3 py-2 rounded cursor-pointer flex items-center gap-1 hover:bg-gray-300">
              <FiUpload />
              Chọn ảnh
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </label>
            {imgPreview && (
              <img
                src={imgPreview}
                alt="preview"
                className="w-20 h-20 object-cover rounded shadow"
              />
            )}
          </div>
          <input
            type="text"
            name="imageUrl"
            placeholder="Hoặc dán link ảnh trực tiếp"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full mt-2 border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Tên sản phẩm</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Mô tả</label>
          <textarea
            name="description"
            required
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Giá (VNĐ)</label>
          <input
            type="number"
            name="price"
            required
            value={form.price}
            min={0}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Danh mục</label>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Chọn hãng/danh mục</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Oppo">Oppo</option>
            <option value="Khác">Khác</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <FiLoader className="animate-spin" />}
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
}
