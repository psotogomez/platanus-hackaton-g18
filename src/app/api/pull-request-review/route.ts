import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log(request);

    return NextResponse.json({
      success: true,
      message: "Pull request reviews retrieved successfully",
      data: [], // Replace with actual data
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve pull request reviews",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
