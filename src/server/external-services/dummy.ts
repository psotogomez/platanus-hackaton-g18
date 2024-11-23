const axios = require("axios");
const { GITHUB_TOKEN } = process.env;

export class DummyExternalService {
  private GITHUB_API_BASE_URL: string;

  constructor() {
    this.GITHUB_API_BASE_URL = "https://api.github.com";
  }

  async getPRFiles(
    owner: string,
    repo: string,
    pullNumber: number,
  ) {
    const url = `${this.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/files`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : undefined,
          Accept: "application/vnd.github.v3+json",
        },
      });
  
      return response.data;
    } catch (error: any) {
      console.error("Error fetching PR files:", error.response.data || error.message);
      throw error;
    }
  }

  async getFileContent(
    owner: string,
    repo: string,
    path: string,
  ){
    const url = `${this.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/contents/${path}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : undefined,
          Accept: "application/vnd.github.v3.raw",
        },
      });
      return response.data; // Raw file content
    } catch (error: any) {
      console.error("Error fetching file content:", error.response.data || error.message);
      throw error;
    }
  }

  async postCommitComment(
    owner: string,
    repo: string,
    commitSha: string,
  ) {
    const url = `${this.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/commits/${commitSha}/comments`;
    try {
      const response = await axios.post(
        url,
        { 
          body: "```suggestion\nhola\n```",
          commit_id: commitSha,
          path: "src/server/external-services/bedrock.ts",
          start_line: 15,
          line: 17,
        },
        {
          headers: {
            Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : undefined,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
  
      console.log(`Comment posted successfully: ${response.data.html_url}`);
    } catch (error: any) {
      console.error("Error posting commit comment:", error.response.data || error.message);
      throw error;
    }
  }

  async analyzePullRequestFiles() {
    const owner = "psotogomez";
    const repo = "platanus-hackaton-g18";
    const pullNumber = 1;
    try {
      const files = await this.getPRFiles(owner, repo, pullNumber);
      console.log(`Retrieved ${files.length} files from PR #${pullNumber}`);
      for (const file of files) {
        console.log(`Fetching content for file: ${file.filename}`);
        const content = await this.getFileContent(owner, repo, file.filename);
        await this.postCommitComment(owner, repo, '39b38a222bed7c7952ee5ea867660cdb428a7ac0');
      }
    } catch (error: any) {
      console.error("Error in the process:", error.message);
    }
  }
}


