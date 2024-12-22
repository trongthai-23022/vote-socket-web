import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { title, options } = await request.json();
    
    if (!title || !options || !Array.isArray(options) || options.length === 0) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // Tạo vote mới
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .insert([{ title }])
      .select()
      .single();

    if (voteError) throw voteError;

    // Tạo các options
    const optionsToInsert = options.map(option => ({
      option,
      vote_id: vote.id
    }));

    const { error: optionsError } = await supabase
      .from('options')
      .insert(optionsToInsert);

    if (optionsError) throw optionsError;

    return NextResponse.json({ id: vote.id });
  } catch (error) {
    console.error("Failed to create vote:", error);
    return NextResponse.json(
      { error: "Failed to create vote" },
      { status: 500 }
    );
  }
}
