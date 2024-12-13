"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";

interface MenuItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export default function CreateVoteMenuPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCrawl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMenuItems([]);
    setSelectedItems([]);

    try {
      const response = await fetch(`/api/crawl?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (response.ok) {
        setMenuItems(data.menuItems);
      } else {
        setError(data.error || 'Có lỗi xảy ra khi lấy dữ liệu');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = (name: string) => {
    setSelectedItems(prev => {
      if (prev.includes(name)) {
        return prev.filter(item => item !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handleCreateVote = async () => {
    if (!title) {
      setError('Vui lòng nhập tiêu đề cho cuộc bình chọn');
      return;
    }
    if (selectedItems.length < 2) {
      setError('Vui lòng chọn ít nhất 2 món ăn');
      return;
    }

    try {
      const response = await axios.post(
        "/api/create-vote",
        {
          title,
          options: selectedItems,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);
      const data = response.data;
      if (response.status === 200) {
        router.push(`/vote/${data.voteId}`);
      } else {
        setError(data.error || 'Có lỗi xảy ra khi tạo bình chọn');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tạo Bình Chọn từ Menu Grab Food</h1>
      
      {/* Form crawl */}
      <form onSubmit={handleCrawl} className="mb-8">
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
            {loading ? 'Đang xử lý...' : 'Lấy Menu'}
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
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề cuộc bình chọn
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề cho cuộc bình chọn"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-4">
            Chọn món ăn ({selectedItems.length} đã chọn)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {menuItems.map((item, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 shadow-lg cursor-pointer transition-colors duration-200 ${
                  selectedItems.includes(item.name) 
                    ? 'border-indigo-600 bg-indigo-50' 
                    : 'hover:border-gray-400'
                }`}
                onClick={() => handleToggleItem(item.name)}
              >
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 mb-2">{item.description}</p>
                )}
                <p className="text-lg font-bold text-indigo-600">{item.price}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleCreateVote}
              disabled={selectedItems.length < 2 || !title}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Tạo Bình Chọn với {selectedItems.length} Món Đã Chọn
            </button>
          </div>
        </div>
      )}

      {menuItems.length === 0 && !loading && !error && (
        <div className="text-center text-gray-500 py-12">
          Nhập URL của nhà hàng trên Grab Food để bắt đầu
        </div>
      )}
    </div>
  );
} 