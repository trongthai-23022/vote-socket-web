import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Thiếu ID cuộc bình chọn" },
        { status: 400 }
      );
    }

    // Lấy thông tin từ bảng votes để xác nhận cuộc bình chọn tồn tại
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .select('id, title')
      .eq('id', id)
      .single();

    if (voteError) {
      console.error("Lỗi khi lấy thông tin vote:", voteError);
      throw voteError;
    }

    if (!vote) {
      return NextResponse.json(
        { error: "Không tìm thấy cuộc bình chọn" },
        { status: 404 }
      );
    }

    // Lấy tất cả các options của cuộc bình chọn
    const { data: options, error: optionsError } = await supabase
      .from('options')
      .select('id, option')
      .eq('vote_id', id);

    if (optionsError) {
      console.error("Lỗi khi lấy options:", optionsError);
      throw optionsError;
    }

    // Tạo map của option IDs để kiểm tra
    const optionIds = new Set(options?.map(opt => opt.id) || []);

    // Lấy tất cả các vote records cho các options của cuộc bình chọn này
    const { data: voteRecords, error: recordsError } = await supabase
      .from('vote_records')
      .select('voter_name, option_id')
      .in('option_id', Array.from(optionIds));

    if (recordsError) {
      console.error("Lỗi khi lấy vote records:", recordsError);
      throw recordsError;
    }

    // Tổ chức dữ liệu theo cấu trúc mới
    const results: Record<string, string[]> = {};

    // Khởi tạo mảng rỗng cho mỗi option
    options?.forEach(option => {
      results[option.id] = [];
    });

    // Thêm voter vào từng option
    voteRecords?.forEach(record => {
      if (record.option_id && results[record.option_id]) {
        results[record.option_id].push(record.voter_name);
      }
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Lỗi khi lấy kết quả bình chọn:", error);
    return NextResponse.json(
      { error: "Không thể lấy kết quả bình chọn" },
      { status: 500 }
    );
  }
} 