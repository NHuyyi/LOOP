import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ModelPostMini from "../../component/user/modelpostmini/modelpostmini";
import Loading from "../../component/Loading/Loading";
import getpost from "../../services/Post/getpost";
import { setPosts } from "../../redux/postSlice";
import { updateReaction } from "../../redux/reactionSlide";
import countreaction from "../../services/Post/reaction/countreaction";
import { useDispatch } from "react-redux";

function PostPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    // 1. Thử lấy bài viết từ Redux (nếu user đi từ Home sang)
    const postFromRedux = useSelector((state) =>
        state.posts.posts.find((p) => String(p._id) === String(id))
    );

    // 2. State cục bộ để lưu bài viết và trạng thái loading
    const [post, setPost] = useState(postFromRedux);
    const [loading, setLoading] = useState(!postFromRedux); // Nếu không có trong Redux thì loading = true

    useEffect(() => {
        // 3. Nếu Redux rỗng (do load lại trang), tiến hành gọi API
        // Thêm điều kiện phải có currentUser để truyền vào getpost
        if (!postFromRedux && id && currentUser?._id) {
            const fetchSinglePost = async () => {
                try {
                    const res = await getpost(currentUser.friends || [], currentUser._id);

                    if (res.success && res.data) {
                        // QUAN TRỌNG: Nạp toàn bộ dữ liệu bài viết vào Redux để các component con (PostReaction) hoạt động
                        dispatch(setPosts(res.data));

                        const foundPost = res.data.find((p) => String(p._id) === String(id));
                        setPost(foundPost);

                        if (foundPost) {
                            // Fetch reaction count và nạp vào Redux reactionSlice
                            const reactRes = await countreaction(foundPost._id);
                            if (reactRes.success) {
                                dispatch(
                                    updateReaction({
                                        postId: foundPost._id,
                                        reactionCounts: reactRes.data.reactionCounts,
                                        totalReactions: reactRes.data.totalReactions,
                                    })
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error("Lỗi bài viết:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchSinglePost();
        } else if (postFromRedux) {
            setPost(postFromRedux);
        }
        // Thêm currentUser vào mảng dependency để useEffect chạy lại khi Redux load xong user
        // eslint-disable-next-line
    }, [id, postFromRedux, currentUser]);

    if (loading) {
        return <Loading fullScreen text="Đang tải bài viết..." />;
    }

    if (!post) {
        return <div style={{ textAlign: "center", marginTop: "50px" }}>Bài viết không tồn tại hoặc đã bị xóa</div>;
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
            <ModelPostMini
                post={post}
                userID={currentUser}
                // Khi vào từ thông báo, navigate(-1) có thể quay ra trang trắng, nên chuyển về home an toàn hơn
                onClose={() => navigate("/home")}
            />
        </div>
    );
}

export default PostPage;