"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Pusher from "pusher-js";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from 'xlsx';
import saveAs from 'file-saver';
import { VoteData } from "@/types";

interface VoteResult {
  option: string;
  votes: number;
  voters: string[];
}

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Thêm hàm helper để rút gọn text
const truncateText = (text: string, maxLength: number = 20) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default function ResultPage({ params }: { params: { slug: string } }) {
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (showLoading = true) => {
    if (showLoading) {
      setInitialLoading(true);
    }
    setError(null);

    try {
      // Fetch vote data
      const [voteRes, resultsRes] = await Promise.all([
        fetch(`/api/get-vote?id=${params.slug}`),
        fetch(`/api/get-vote-results?id=${params.slug}`)
      ]);

      if (!voteRes.ok) {
        throw new Error("Không thể tải thông tin bình chọn");
      }

      if (!resultsRes.ok) {
        throw new Error("Không thể tải kết quả bình chọn");
      }

      const [voteDataResult, resultsData] = await Promise.all([
        voteRes.json(),
        resultsRes.json()
      ]);

      if (!voteDataResult) {
        throw new Error("Không tìm thấy thông tin bình chọn");
      }

      setVoteData(voteDataResult);

      // Transform data if needed
      if (!resultsData) {
        setVoteResults([]);
        return;
      }

      // Chuyển đổi dữ liệu từ API thành định dạng VoteResult
      const transformedResults: VoteResult[] = voteDataResult.options.map((option: any) => ({
        option: option.option,
        votes: resultsData[option.id]?.length || 0,
        voters: resultsData[option.id] || []
      }));

      setVoteResults(transformedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      console.error("Error fetching data:", err);
    } finally {
      if (showLoading) {
        setInitialLoading(false);
      }
    }
  };

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    });

    const channel = pusher.subscribe('voting-channel');
    
    channel.bind('vote-updated', () => {
      // Không hiển thị loading khi update realtime
      fetchData(false);
    });

    // Chỉ hiển thị loading lần đầu load trang
    fetchData(true);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [params.slug]);

  const voteFiltered = voteResults.filter(result => result.votes > 0);
  const chartData = {
    labels: voteResults.map(result => truncateText(result.option)),
    datasets: [
      {
        label: 'Số lượt bình chọn',
        data: voteResults.map(result => result.votes),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',   // Indigo
          'rgba(167, 139, 250, 0.8)',  // Purple
          'rgba(236, 72, 153, 0.8)',   // Pink
          'rgba(248, 113, 113, 0.8)',  // Red
          'rgba(251, 146, 60, 0.8)',   // Orange
          'rgba(250, 204, 21, 0.8)',   // Yellow
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(167, 139, 250)',
          'rgb(236, 72, 153)',
          'rgb(248, 113, 113)',
          'rgb(251, 146, 60)',
          'rgb(250, 204, 21)',
        ],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép điều chỉnh kích thước linh hoạt
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // Hiển thị label đầy đủ trong tooltip
          label: (context: any) => {
            const index = context.dataIndex;
            return `${voteResults[index].option}: ${context.formattedValue} lượt`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          },
          // maxRotation: 45,
          // minRotation: 45
        },
        grid: {
          display: false
        }
      }
    },
  };

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(
        voteResults.map(result => ({
          'Tùy chọn': result.option,
          'Số lượt bình chọn': result.votes,
          'Người bình chọn': result.voters.join(', ')
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Kết quả bình chọn');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, 'ket-qua-binh-chon.xlsx');
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      alert("Có lỗi khi xuất file Excel");
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchData(true)}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!voteData || voteResults.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có dữ liệu</h2>
          <p className="text-gray-600">Chưa có ai tham gia bình chọn.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              {voteData.title}
            </h1>
            <p className="text-gray-600 text-lg">
              Tổng số lượt bình chọn: {' '}
              <span className="font-semibold text-indigo-600">
                {voteResults.reduce((acc, curr) => acc + curr.votes, 0)}
              </span>
            </p>
          </div>

          <div className="mb-8 h-[400px]"> {/* Cố định chiều cao cho biểu đồ */}
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="space-y-6">
            {voteFiltered.map((result, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{result.option}</h3>
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-1.5 px-4 rounded-full text-sm font-medium">
                    {result.votes} lượt bình chọn
                  </span>
                </div>
                {result.voters.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Người đã bình chọn:</span>{' '}
                    <span className="italic">{result.voters.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={exportToExcel}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Xuất Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 