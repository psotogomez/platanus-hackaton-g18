export class GithubApi {
  private GITHUB_API_BASE_URL: string;
  private GITHUB_TOKEN: string;

  constructor() {
    this.GITHUB_API_BASE_URL = "https://api.github.com";
    this.GITHUB_TOKEN = `${process.env.GITHUB_TOKEN}`;
  }

  async getPRFiles(props: { owner: string; repo: string; pullNumber: string }) {
    const { owner, repo, pullNumber } = props;

    const url = `${this.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/files`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  async getFileContent(props: { owner: string; repo: string; path: string }) {
    const { owner, repo, path } = props;
    const url = `${this.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/contents/${path}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
      });
      const content = await response.text();

      return content;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async postCommitComment(props: {
    owner: string;
    repo: string;
    commitSha: string;
    pullNumber: string;
    body: string;
    filePath: string;
    line: number;
    startLine: number;
  }) {
    const {
      owner,
      repo,
      commitSha,
      pullNumber,
      body,
      filePath,
      line,
      startLine,
    } = props;
    const url = `${this.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/comments`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          body,
          commit_id: commitSha,
          path: filePath,
          start_line: startLine,
          line,
        }),
      });

      const jsonResponse = await response.json();

      return jsonResponse;
    } catch (error) {
      throw error;
    }
  }

  async getPRCommits(props: {
    owner: string;
    repo: string;
    pullNumber: string;
  }): Promise<string[]> {
    const { owner, repo, pullNumber } = props;
    const url = `${this.GITHUB_API_BASE_URL}/repos/${owner}/${repo}/pulls/${pullNumber}/commits`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      const commits = await response.json();

      const commitShas = commits.map((commit: { sha: string }) => commit.sha);
      return commitShas;
    } catch (error) {
      throw error;
    }
  }
}
