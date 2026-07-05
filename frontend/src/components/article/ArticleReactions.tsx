"use client";
import { useState } from "react";
import { ArticleAPI } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";

interface Props { articleId: string; initialLikes: number; }

export function ArticleReactions({ articleId, initialLikes }: Props) {
  const { token } = useAuthStore();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = async () => {
    if (!token) return alert("Sign in to like articles");
    const res = await ArticleAPI.like(articleId, token) as { action: string; likes: number };
    setLikes(res.likes);
    setLiked(res.action === "liked");
  };

  const handleBookmark = async () => {
    if (!token) return alert("Sign in to save articles");
    const res = await ArticleAPI.bookmark(articleId, token) as { action: string };
    setBookmarked(res.action === "saved");
  };

  return (
    <div className="flex items-center gap-4 py-8 border-t border-b border-gray-100 my-8">
      <button onClick={handleLike} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${liked ? "bg-red-50 text-red-600 border-2 border-red-200" : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"}`}>
        {liked ? "❤️" : "🤍"} {likes} Likes
      </button>
      <button onClick={handleBookmark} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${bookmarked ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-200" : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"}`}>
        {bookmarked ? "🔖 Saved" : "📑 Save"}
      </button>
    </div>
  );
}
