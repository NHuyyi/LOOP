const mongoose = require("mongoose");

const connect_DB = async () => {
  try {
    // Kết nối đến MongoDB
    const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(url);
    console.log("✅ Kết nối MongoDB thành công");
  } catch (error) {
    console.error("❌ Kết nối MongoDB thất bại:", error.message);
    process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
  }
};

module.exports = connect_DB;
