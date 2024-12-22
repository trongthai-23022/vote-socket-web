"use client";
import { useState } from "react";
import Image from 'next/image';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export default function CrawlPage() {
  const [url, setUrl] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMenuItems([]);

    try {
      const response = await fetch(`/api/crawl?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (response.ok) {
        setMenuItems(data.menuItems);
      } else {
        setError(data.error || "Có lỗi xảy ra khi lấy dữ liệu");
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      setError('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lấy Menu từ Grab Food</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Nhập URL của nhà hàng trên Grab Food"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Lấy Menu"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-2xl text-gray-600">Đang tải dữ liệu...</div>
        </div>
      )}

      {menuItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Kết quả ({menuItems.length} món)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-lg">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 mb-2">{item.description}</p>
                )}
                <p className="text-lg font-bold text-indigo-600">
                  {item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {menuItems.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500 py-12">
          Nhập URL của nhà hàng trên Grab Food để xem menu
        </div>
      )}
    </div>
  );
}
