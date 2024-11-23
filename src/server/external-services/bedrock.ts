import { BedrockClient, InvokeModelCommand } from "@aws-sdk/client-bedrock";

export class BedrockService {
  private client: BedrockClient;

  constructor(region: string = "us-east-1") {
    // Initialize the AWS Bedrock client
    this.client = new BedrockClient({ region });
  }

  /**
   * Fetches pull request reviews (Dummy method to simulate functionality)
   * @returns A promise resolving to an empty array
   */
  async getPullRequestReviews(): Promise<any[]> {
    return [];
  }

  /**
   * Invokes a foundation model in AWS Bedrock
   * @param modelId - The ID of the foundation model
   * @param payload - The input payload for the model
   * @returns A promise resolving to the model's response
   */
  async callModel(modelId: string, payload: { prompt: string; maxTokens?: number }): Promise<any> {
    try {
      const command = new InvokeModelCommand({
        modelId,
        body: JSON.stringify(payload),
        accept: "application/json",
        contentType: "application/json",
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      return responseBody;
    } catch (error) {
      console.error("Error calling Bedrock model:", error);
      throw error;
    }
  }
}

(async () => {
  const service = new BedrockService();

  const reviews = await service.getPullRequestReviews();
  console.log("Pull Request Reviews:", reviews);

  const modelId = "amazon.titan-tg1-large";
  const payload = { prompt: "Write a creative story about a futuristic city.", maxTokens: 100 };

  try {
    const modelResponse = await service.callModel(modelId, payload);
    console.log("Model Response:", modelResponse);
  } catch (err) {
    console.error("Error during Bedrock model invocation:", err);
  }
})();
