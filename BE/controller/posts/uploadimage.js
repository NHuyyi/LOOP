const multer = require("multer");
const { cloudinary } = require("../../config/Cloudinary");

const storage = multer.memoryStorage(); // tải ảnh lên ram
const upload = multer({ storage });

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file nào được upload" });
    }

    const fileBuffer = req.file.buffer; // chuyển hệ nhị phân
    const fileBase64 = `data:${req.file.mimetype};base64,${fileBuffer.toString(
      "base64"
    )}`; // chuyển thành chuổi base64

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "LOOP",
      resource_type: "image",
    });
    // nếu muốn thêm ảnh cho sản phẩm thây vì xuất giá trị của result.secure_url thì ta tiến hành API tạo sản phẩm mới với cột hình ảnh của sản phầm sẽ là url.secure_url
    return res.json({
      message: "Tải ảnh thành công",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    return res
      .status(500)
      .json({ message: "Kết nối server bị lỗi", success: false });
  }
};

module.exports = { upload, uploadImage };
