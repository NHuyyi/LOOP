// src/hooks/getpost.js
import { useEffect, useState } from "react";
import getpost from "../services/Post/getpost";

export function useGetPost(friendIds, userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const result = await getpost(friendIds, userId);
        if (result.success) {
          setPosts(result.data || []);
        } else {
          console.error(result.message);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [friendIds, userId]);

  return { posts, loading };
}
