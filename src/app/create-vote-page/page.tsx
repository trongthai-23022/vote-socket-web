"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import CrawlForm from '@/app/components/CrawlForm';
import MenuItemCard from '@/app/components/MenuItemCard';
import VoteCreationForm from '@/app/components/VoteCreationForm';
import Input from '../components/ui/Input';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

export default function CreateVoteMenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCrawl, setErrorCrawl] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [manualOptions, setManualOptions] = useState<string[]>(['']);
  const [grabfood, setGrabfood] = useState(false);

  const handleCrawl = async (url: string) => {
    setLoading(true);
    setErrorCrawl(null);
    setMenuItems([]);
    setSelectedItems([]);

    try {
      const response = await fetch(`/api/crawl?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (response.ok) {
        setMenuItems([]);
        setMenuItems(data.menuItems);
      } else {
        setErrorCrawl(data.error || 'Có lỗi xảy ra khi lấy dữ liệu');
      }
    } catch (err) {
      setErrorCrawl('Không thể kết nối đến server');
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

  const handleAddManualOption = () => {
    setManualOptions(prev => [...prev, '']);
  };

  const handleManualOptionChange = (index: number, value: string) => {
    setManualOptions(prev => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleRemoveManualOption = (index: number) => {
    setManualOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateVote = async () => {
    if (!title) {
      setError('Vui lòng nhập tiêu đề cho cuộc bình chọn');
      return;
    }

    // Kết hợp các tùy chọn từ menu đã chọn và các tùy chọn thủ công
    const validManualOptions = manualOptions.filter(option => option.trim() !== '');
    const allOptions = [...selectedItems, ...validManualOptions];

    if (allOptions.length < 2) {
      setError('Vui lòng chọn hoặc nhập ít nhất 2 tùy chọn');
      return;
    }

    try {
      const response = await axios.post(
        "/api/create-vote",
        {
          title,
          options: allOptions,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
       <div className="flex items-center mb-8">
            <label htmlFor="grabfood-toggle" className="text-lg font-semibold mr-4">Grab Food</label>
            <input
              id="grabfood-toggle"
              type="checkbox"
              checked={grabfood}
              onChange={(e) => setGrabfood(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
            />
          </div>
      {grabfood && (
        <>
          <h1 className="text-3xl font-bold mb-8 text-green-500">Tạo Bình Chọn từ Menu Grab Food</h1>
         
          <CrawlForm onCrawl={handleCrawl} loading={loading} error={errorCrawl} />

          {menuItems.length === 0 && !loading && !error && (
            <div className="text-center text-gray-500">
              Nhập URL của nhà hàng trên Grab Food để bắt đầu
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-2xl text-gray-600">Đang tải dữ liệu...</div>
            </div>
          )}
        </>
      )}

      <div className="mt-8">
        <h2 className="text-3xl font-semibold mb-4 text-indigo-500">Nhập Tiêu Đề Cuộc Bình Chọn</h2>
        <Input
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded text-black w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề..."
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Thêm Tùy Chọn Thủ Công</h2>
        <div className="space-y-4">
          {manualOptions.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-300 p-2 rounded text-black"
                value={option}
                onChange={(e) => handleManualOptionChange(index, e.target.value)}
                placeholder="Nhập tùy chọn..."
              />
              <button
                type="button"
                onClick={() => handleRemoveManualOption(index)}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddManualOption}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            +
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}

      {menuItems.length > 0 && (
        <div>
          <VoteCreationForm title={title} manualOptions={manualOptions} selectedItems={selectedItems} onCreateVote={handleCreateVote} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {menuItems.map((item, index) => (
              <MenuItemCard 
                key={index} 
                item={item} 
                isSelected={selectedItems.includes(item.name)} 
                onToggle={handleToggleItem} 
              />
            ))}
          </div>
        </div>
      )}


      {menuItems.length === 0 && (
        <div className="mt-8">
          <button
            type="button"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
          onClick={handleCreateVote}
        >
          Tạo Bình Chọn
        </button>
      </div> )}



    </div>
  );
}