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

export default function CreateVotePage() {
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
        const uniqueMenuItems = data.menuItems.reduce((acc: MenuItem[], current: MenuItem) => {
          const exists = acc.find(item => item.name.toLowerCase() === current.name.toLowerCase());
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        setMenuItems([]);
        setMenuItems(uniqueMenuItems);
      } else {
        setErrorCrawl(data.error || 'Có lỗi xảy ra khi lấy dữ liệu');
      }
    } catch (err) {
      setErrorCrawl('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = (name: string, price: string) => {
    setSelectedItems(prev => {
      if (prev.includes(name + ' - ' + price)) {
        return prev.filter(item => item !== name + ' - ' + price);
      } else {
        return [...prev, name + ' - ' + price];
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
        router.push(`/create-vote/result?id=${data.id}`);
      } else {
        setError(data.error || 'Có lỗi xảy ra khi tạo bình chọn');
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      setError('Không thể kết nối đến server');
    }
  };

  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      const allSelected = menuItems.map(item => item.name + ' - ' + item.price);
      setSelectedItems(allSelected);
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-8">
            <label htmlFor="grabfood-toggle" className="text-lg font-semibold mr-4 text-gray-700 flex items-center cursor-pointer">
              <span className="mr-4">Lấy Menu từ Grab Food</span>
              <div className="relative">
                <input
                  id="grabfood-toggle"
                  type="checkbox"
                  checked={grabfood}
                  onChange={(e) => setGrabfood(e.target.checked)}
                  className="sr-only"
                />
                <div className="toggle-switch" data-checked={grabfood}></div>
              </div>
            </label>
          </div>

          {grabfood && (
            <div className="animate-fadeIn">
              <h1 className="text-3xl font-bold mb-8 text-green-600 flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Tạo Bình Chọn từ Menu Grab Food
              </h1>
              <CrawlForm onCrawl={handleCrawl} loading={loading} error={errorCrawl} />

              {menuItems.length === 0 && !loading && !error && (
                <div className="text-center text-gray-500 mt-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Nhập URL của nhà hàng trên Grab Food để bắt đầu
                </div>
              )}

              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  <div className="ml-4 text-2xl text-gray-600">Đang tải dữ liệu...</div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-3xl font-semibold mb-6 text-indigo-600 flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              Nhập Tiêu Đề Cuộc Bình Chọn
            </h2>
            <Input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề..."
            />
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-purple-600 flex items-center">
              <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Thêm Tùy Chọn
            </h2>
            <div className="space-y-4">
              {manualOptions.map((option, index) => (
                <div key={index} className="flex gap-3 group">
                  <input
                    type="text"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-200 hover:border-purple-300"
                    value={option}
                    onChange={(e) => handleManualOptionChange(index, e.target.value)}
                    placeholder="Nhập tùy chọn..."
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveManualOption(index)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 opacity-80 group-hover:opacity-100 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddManualOption}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition duration-200 shadow-md flex items-center justify-center w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Thêm Tùy Chọn
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {error}
            </div>
          )}

          {menuItems.length > 0 && (
            <div className="mt-8 animate-fadeIn">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="select-all"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="hidden"
                />
                <label htmlFor="select-all" className="flex items-center cursor-pointer">
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-md flex items-center justify-center mr-2">
                    <div className={`w-3 h-3 bg-indigo-500 rounded-md ${selectedItems.length === menuItems.length ? 'block' : 'hidden'}`}></div>
                  </div>
                  <span className="font-semibold">Chọn tất cả</span>
                </label>
              </div>
              <VoteCreationForm title={title} manualOptions={manualOptions} selectedItems={selectedItems} onCreateVote={handleCreateVote} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {menuItems.map((item, index) => (
                  <MenuItemCard 
                    key={index} 
                    item={item} 
                    isSelected={selectedItems.includes(item.name + ' - ' + item.price)} 
                    onToggle={(name) => handleToggleItem(item.name, item.price)} 
                  />
                ))}
              </div>
            </div>
          )}

          {menuItems.length === 0 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:opacity-90 transition duration-200 font-semibold text-lg shadow-lg flex items-center"
                onClick={handleCreateVote}
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Tạo Bình Chọn
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 