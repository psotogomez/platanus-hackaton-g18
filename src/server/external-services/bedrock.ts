import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

function parseCommentAndCode(responseText: string) {
  // Regular expression to match content between ``` and ```
  const codeRegex = /```[\s\S]*?\n([\s\S]*?)\n```/;

  // Extract the first code block
  const codeMatch = responseText.match(codeRegex);
  const code = codeMatch ? codeMatch[1].trim() : ""; // If no code block, return an empty string

  // Remove the code block to get the comment
  const comment = responseText.replace(codeRegex, "").trim();

  // Return the JSON object with comment and code
  return {
    comment,
    code,
  };
}

const client = new BedrockRuntimeClient({
    region: `${process.env.AWS_DEFAULT_REGION}`,
    credentials: {
        accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
    }
});

async function invokeModel(instruction: string, fileContent: string, afterChange: string) {
  const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";

  interface Prompt {
      text: string;
    }

  const systemPrompt: Prompt[] = [
    {
      text: `You are an expert software developer and architect. You are an expert in software reliability, security, scalability, and performance. Your task is to review GitHub pull request changes and suggest changes to specific batches. You will receive the complete unedited file code, and then a batch thta includes one or more changes i made in the original code. "+" means its a line i added and "-" means its a line i removed. Taking into consideration my complete file, tell me if my addition and or removals were correct (using CleanCode). If they weren't, correct it and return me the corrected "batch" (only if they are fundamentally needed, else not) based on CleanCode. Feel free to also include a comment if the change implies changing something else in my file.
  Your output needs to be in GitHub-flavored markdown and changes should only be made if they are fundamentally needed, and only modify the specific batch, taking into consideration the complete file as context. If the batch is changed, you must indicate a comment as for why the change was made followed by the changed batch enclosed in three backticks (\`\`\`) at the start and the end of the code block.
  Additions will be indicated by a preceding plus sign (+) and deletions by a minus sign (-). Your output code must not include these indications. Only output the comment first and then the code, no comments afterwards.`
    },
  ];

  const userPrompt1: string = `
  ### Instruction:
  Make sure that the variables and functions feature descriptive naming and the code is compliant with proper cybersecurity measures, reducing possible vulnerabilities in its implementation.

  ### Unedited file:
  "use client";

  import { H1, P } from "@/ui/components/typography";
  import { Button } from "@/ui/components/button";
  import { WithPullRequestReviewConfigurationForm } from "./_components/with-pull-request-review-configuration-form";
  import { PullRequestReviewConfigurationForm } from "./_components/pull-request-review-configuration-form";

  export default function Home() {
    const function1 = (a: number, b: number) => {
      return a + b;
    };

    return (
      <div className="flex flex-col size-full justify-center items-center gap-8">
        <div className="flex flex-col gap-2 justify-center items-center">
          <H1>Peer Rhino</H1>
          <P>
            Peer Rhino is a platform for automatic pull requests reviews in your
            GitHub repositories.
          </P>
        </div>
        <div className="flex flex-col w-3/5 border border-dark rounded-lg p-4 shadow-lg max-w-3xl bg-muted">
          <WithPullRequestReviewConfigurationForm>
            <PullRequestReviewConfigurationForm />
          </WithPullRequestReviewConfigurationForm>
        </div>
        <Button
          onClick={() => function1(1, 2)}
          style={{
            backgroundColor: "red",
          }}
        >
          Click me
        </Button>
      </div>
    );
  }

  ### Changed batch:
  + "use client";
  +
  import { H1, P } from "@/ui/components/typography";
  + import { Button } from "@/ui/components/button";
  import { WithPullRequestReviewConfigurationForm } from "./_components/with-pull-request-review-configuration-form";
  import { PullRequestReviewConfigurationForm } from "./_components/pull-request-review-configuration-form";

  export default function Home() {
  +  const function1 = (a: number, b: number) => {
  +    return a + b;
  +  };

    return (
      <div className="flex flex-col size-full justify-center items-center gap-8">
        <div className="flex flex-col gap-2 justify-center items-center">
  `;

  const assistantResponse1: string = `
  The function function1 is poorly named - it doesn't describe its purpose and the function is defined but only used once with hardcoded values, which indicates it might be unnecessary. As an additional recommendation you
  should remove the function1 declaration entirely from the component since it's not serving any real purpos

  \`\`\`
  use client";

  import { H1, P } from "@/ui/components/typography";
  import { Button } from "@/ui/components/button";
  import { WithPullRequestReviewConfigurationForm } from "./_components/with-pull-request-review-configuration-form";
  import { PullRequestReviewConfigurationForm } from "./_components/pull-request-review-configuration-form";

  export default function Home() {
    const addNumbers = (a: number, b: number) => {
    return a + b;
  };

    return (
      <div className="flex flex-col size-full justify-center items-center gap-8">
        <div className="flex flex-col gap-2 justify-center items-center">
  \`\`\`
  `;

  const userPrompt2: string = `
  ### Instruction:
  Make sure that the variables and functions feature descriptive naming and the code is compliant with proper cybersecurity measures, reducing possible vulnerabilities in its implementation.

  ### Unedited file content:
  std::string hashPassword(const std::string& plainTextPassword) {
      return sha256(plainTextPassword);
  }

  void logAuthenticationAttempt(const std::string& username, bool success) {
      std::cout << "User " << username << " authentication "
                << (success ? "succeeded" : "failed") << "." << std::endl;
  }

  ### Changed batch:
  -std::string hashPassword(const std::string& plainTextPassword) {
  +std::string hashPassword(const std::string& password) {
  -    return sha256(plainTextPassword);
  +    return sha256(password);

  void logAuthenticationAttempt(const std::string& username, bool success) {
      std::cout << "User " << username << " authentication ";
  }
  `;

  const assistantResponse2: string = `
  The proposed changes are clear and maintain both descriptive naming and cybersecurity compliance. No further adjustments are needed.
  `;

  // const instruction: string | null = null;
  // const fileContent: string | null = null;
  // const afterChange: string | null = null;

  const userPrompt3: string = `
  ### Instruction:
  Make sure that the variables and functions feature descriptive naming and the code is compliant with proper cybersecurity measures, reducing possible vulnerabilities in its implementation.

  ### Unedited file:
  import { analyzePullRequestFiles } from "@/server/use-cases/analize-pull-request";
import { NextResponse } from "next/server";
import { z } from "zod";

const pullRequestReviewSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  pullNumber: z.string(),
  meaningfulVariableNames: z.boolean(),
  codeSecurityBreaches: z.boolean(),
  prompt: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const { headers } = request;
    const authorization = headers.get("Authorization");
    if (!authorization || authorization !== Bearer process.env.API_KEY {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    console.log("request body", request);

    const body = await request.json();
    const {
      owner,
      repo,
      pullNumber,
      meaningfulVariableNames,
      codeSecurityBreaches,
      prompt,
    } = pullRequestReviewSchema.parse(body);

    await analyzePullRequestFiles({
      owner,
      repo,
      pullNumber,
      meaningfulVariableNames,
      codeSecurityBreaches,
      prompt,
    });

    return NextResponse.json({
      success: true,
      message: "Pull request review started",
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

  ### Changed batch:
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  console.log("request body", request);

  const body = await request.json();
  const {`;


  const assistantResponse3: string = `
  No changes were necesary`;

  const userQuestion: string = `
  ### Instruction:
  ${instruction}

  ### Unedited file content:
  ${fileContent}

  ### Proposed changes:
  ${afterChange}
  `;

  interface ConversationEntry {
    role: "user" | "assistant";
    content: Prompt[];
  }

  const conversation: ConversationEntry[] = [
    {
      role: "user",
      content: [{ text: userPrompt1 }],
    },
    {
      role: "assistant",
      content: [{ text: assistantResponse1 }],
    },
    {
      role: "user",
      content: [{ text: userPrompt2 }],
    },
    {
      role: "assistant",
      content: [{ text: assistantResponse2 }],
    },
    {
      role: "user",
      content: [{ text: userQuestion }],
    },
  ];

  const additionalParameters = {
    temperature: 0.3,
  };

  try{
    const response = await client.send(
        new ConverseCommand({
            modelId,
            messages: conversation,
            system: systemPrompt,
            inferenceConfig: additionalParameters,
        })
    );

    if (!response || !response.output || !response.output.message || !response.output.message.content) {
      throw new Error("Failed to retrieve response from model");
    }

    const responseText: string = response.output?.message?.content[0]?.text ?? "No response received.";

    const jsonCommentCode = parseCommentAndCode(responseText);

    // console.log(jsonCommentCode);
    return jsonCommentCode;

  } catch (error) {
    console.error("Error while sending the request:", error);
  }

}

export default invokeModel;