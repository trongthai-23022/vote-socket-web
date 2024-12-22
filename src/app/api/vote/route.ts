import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { pusher } from "@/lib/pusher";

export async function POST(request: Request) {
  try {
    const { optionId, voterName } = await request.json();
    
    if (!optionId || !voterName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Lưu vote record
    const { error: voteError } = await supabase
      .from('vote_records')
      .insert([
        {
          voter_name: voterName,
          option_id: optionId,
        }
      ]);

    if (voteError) throw voteError;

    // Cập nhật số lượng vote cho option
    const { error: updateError } = await supabase.rpc('increment_vote', {
      option_id: optionId
    });

    if (updateError) throw updateError;

    // Trigger Pusher event
    await pusher.trigger("voting-channel", "vote-updated", {
      message: "Vote updated"
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save vote:", error);
    return NextResponse.json(
      { error: "Failed to save vote" },
      { status: 500 }
    );
  }
}
