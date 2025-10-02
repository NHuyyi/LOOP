// controllers/postController.js
const PostModel = require("../../model/Post.Model");
const UserModel = require("../../model/User.Model"); // để lấy danh sách bạn bè

exports.NewPost = async (req, res) => {
  try {
    const { imageUrl, content, author, visibility, denyList } = req.body;

    if (!content || !author) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ nội dung và tác giả",
        success: false,
      });
    }

    let finalVisibility = visibility || "friends";
    let finalDenyList = [];

    // Trường hợp custom
    if (finalVisibility === "custom") {
      if (Array.isArray(denyList) && denyList.length > 0) {
        finalDenyList = denyList;
      } else {
        // nếu denyList rỗng thì mặc định thành "friends"
        finalVisibility = "friends";
      }
    }

    // Trường hợp private
    if (finalVisibility === "private") {
      // lấy danh sách bạn bè của author
      const user = await UserModel.findById(author).select("friends");
      if (user && user.friends) {
        finalDenyList = user.friends; // chặn toàn bộ bạn bè
      }
    }

    const newPost = new PostModel({
      imageUrl,
      content,
      author,
      visibility: finalVisibility,
      denyList: finalDenyList,
    });

    await newPost.save();

    return res.status(201).json({
      message: "Tạo bài viết thành công",
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    return res.status(500).json({
      message: "Kết nối server bị lỗi",
      success: false,
    });
  }
};
