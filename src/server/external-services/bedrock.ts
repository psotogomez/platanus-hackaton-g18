import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

// function parseCommentAndCode(responseText: string) {
//   // Regular expression to match content between the ``` markers
//   const codeRegex = /```([\s\S]*?)```/;

//   // Extract the first code block
//   const codeMatch = responseText.match(codeRegex);
//   const code = codeMatch ? codeMatch[1] : ""; // If there's no code block, return an empty string

//   // Remove the code block to get the comment
//   const comment = responseText.replace(codeRegex, "").trim();

//   // Return the parsed comment and the single code block
//   return {
//     comment,
//     code,
//   };
// }

const client = new BedrockRuntimeClient({
  region: `${process.env.AWS_DEFAULT_REGION}`,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

async function invokeModel(
  instruction: string,
  fileContent: string,
  afterChange: string
) {
  const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";

  interface Prompt {
    text: string;
  }

  const systemPrompt: Prompt[] = [
    {
      text: `You are an expert software developer and architect. You are an expert in software reliability, security, scalability, and performance. Your task is to review GitHub pull request changes and suggest changes to those specific lines (only if they are fundamentally needed, else not) based on an instruction on what it needs to look for.
  Your output needs to be in GitHub-flavored markdown and changes should only be made if they are fundamentally needed because the original code breaches the indications to review in the instruction. If so, you must indicate a comment as for why the change was made followed by the changes in code enclosed in three backticks (\`\`\`) at the start and the end of the code block.
  Additions will be indicated by a preceding plus sign (+) and deletions by a minus sign (-). Your output code must not include these indications but rather only feature the changed code snippet as it would look like once the pull request got merged. Only output the comment first and then the code, no comments afterwards.`,
    },
  ];

  const userPrompt1: string = `
  ### Instruction:
  Make sure that the variables and functions feature descriptive naming and the code is compliant with proper cybersecurity measures, reducing possible vulnerabilities in its implementation.

  ### Original file content:
  void processData(int a, int b) {
      int c = a + b;
      std::cout << c << std::endl;
  }

  bool checkAuth(std::string user, std::string pass) {
      if (user == "admin" && pass == "1234") {
          return true;
      }
      return false;
  }

  ### Proposed changes:
  std::cout << c << std::endl; }

  bool checkAuth(std::string username, std::string password) {
      - if (user == "admin" && pass == "1234") {
      + if (username == "admin" && password == "1234") {
          return true;
      }
      return false;
  }
  `;

  const assistantResponse1: string = `
  The user's proposed changes improved the variable names, but the hardcoded credentials still present a significant security vulnerability. Adjusted the code to remove the hardcoded values and use a secure authentication mechanism.

  \`\`\`cpp
  std::cout << c << std::endl;
  }

  bool verifyUserCredentials(const std::string& username, const std::string& password) {
      // Use a secure method to validate credentials (needs to be implemented)
      const auto storedHash = getPasswordHashFromDatabase(username);
      return verifyPasswordHash(password, storedHash);
  }
  \`\`\`
  `;

  const userPrompt2: string = `
  ### Instruction:
  Make sure that the variables and functions feature descriptive naming and the code is compliant with proper cybersecurity measures, reducing possible vulnerabilities in its implementation.

  ### Original file content:
  std::string hashPassword(const std::string& plainTextPassword) {
      return sha256(plainTextPassword);
  }

  void logAuthenticationAttempt(const std::string& username, bool success) {
      std::cout << "User " << username << " authentication "
                << (success ? "succeeded" : "failed") << "." << std::endl;
  }

  ### Proposed changes:
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

  const userQuestion: string = `
  ### Instruction:
  ${instruction}

  ### Original file content:
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

  try {
    const response = await client.send(
      new ConverseCommand({
        modelId,
        messages: conversation,
        system: systemPrompt,
        inferenceConfig: additionalParameters,
      })
    );

    if (
      !response ||
      !response.output ||
      !response.output.message ||
      !response.output.message.content
    ) {
      throw new Error("Failed to retrieve response from model");
    }

    const responseText: string =
      response.output?.message?.content[0]?.text ?? "No response received.";
    console.log(responseText);
  } catch (error) {
    console.error("Error while sending the request:", error);
  }
}

export default invokeModel;
