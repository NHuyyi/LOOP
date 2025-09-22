const PostModel = require("../../model/Post.Model");

exports.NewPost = async (req, res) => {
  try {
    const { imageUrl, content, author } = req.body;

    // kiểm tra xem thông tin đã được điền đầy đủ chưa
    if (!imageUrl || !content || !author) {
      return res.status(400).json({
        message: "vui lòng điền đầy đủ các thông tin",
        success: false,
      });
    }
    const newPost = new PostModel({
      imageUrl,
      content,
      author,
    });

    await newPost.save();

    return res.status(201).json({
      message: "Tạo bài viết thành công",
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error("lỗi tạo bài viết:", error);
    return res
      .status(500)
      .json({ message: "Kết nối server bị lỗi", success: false });
  }
};
