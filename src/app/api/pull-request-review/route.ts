import { analyzePullRequestFiles } from "@/server/use-cases/analize-pull-request";
import { NextResponse } from "next/server";
import { z } from "zod";

const pullRequestReviewSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  pullNumber: z.string(),
  prompt: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const { headers } = request;
    const authorization = headers.get("Authorization");
    if (!authorization || authorization !== `Bearer ${process.env.API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { owner, repo, pullNumber } = pullRequestReviewSchema.parse(body);

    analyzePullRequestFiles({ owner, repo, pullNumber });

    return NextResponse.json({
      success: true,
      message: "Pull request reviews retrieved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
