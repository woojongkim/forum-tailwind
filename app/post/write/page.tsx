export default function PostWrite() {
  return (
    <div className="flex flex-wrap content-center justify-center w-full h-full">
      <form className="max-w-xl" action="/api/post" method="POST">
        <div className="mb-4">
          <input
            type="text"
            placeholder="제목"
            name="title"
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="content"
            placeholder="내용"
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          작성
        </button>
      </form>
    </div>
  );
}
