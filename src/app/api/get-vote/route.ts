import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Missing vote ID" },
        { status: 400 }
      );
    }

    // Lấy thông tin vote và options
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .select(`
        id,
        title,
        options (
          id,
          option,
          votes
        )
      `)
      .eq('id', id)
      .single();

    if (voteError) throw voteError;

    return NextResponse.json(vote);
  } catch (error) {
    console.error("Failed to fetch vote:", error);
    return NextResponse.json(
      { error: "Failed to fetch vote" },
      { status: 500 }
    );
  }
}
