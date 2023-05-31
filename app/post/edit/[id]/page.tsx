"use client";

import { Post } from "@/types/post";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Props = {
  params: {
    id: string;
  };
};

function Edit({ params }: Props) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(`/api/post/${params.id}`);
      const post = await response.json();
      setPost(post);
      setTitle(post.title);
      setContent(post.content);
    }

    fetchPost();
  }, [params.id]);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await fetch(`/api/post`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: params.id,
        title,
        content,
      }),
    });

    if (response.ok) {
      console.log("success");
      router.push(`/post/${params.id}`);
      router.refresh();
    } else {
      console.log("fail");
    }
  }

  if (post === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4 text-lg font-medium">
          Category: {post.category}
        </div>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block mb-2 font-medium text-gray-200"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block mb-2 font-medium text-gray-200"
          >
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className="w-full px-3 py-2 text-gray-700 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-2 text-sm text-gray-200">Author: {post.cuser}</div>
        <div className="mb-2 text-sm text-gray-200">View: {post.view}</div>
        <div className="mb-4 text-sm text-gray-200">
          Comments: {post.comments}
        </div>
        <div className="mb-4 text-sm text-gray-200">Likes: {post.likes}</div>
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 ml-4 text-base font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 ml-4 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Edit.useClient = true;
export default Edit;
