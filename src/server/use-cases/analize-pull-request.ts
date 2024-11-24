import { GithubApi } from "../external-services/github-api";
import { AllFileChanges, FileChange } from "../../interfaces/IPullRequest";

export const analyzePullRequestFiles = async (props: {
  owner: string;
  repo: string;
  pullNumber: string;
  prompt?: string;
}) => {
  const { owner, repo, pullNumber } = props;
  console.log("Analyzing PR files...");
  const githubApi = new GithubApi();

  const files = await githubApi.getPRFiles({ owner, repo, pullNumber });
  const allFileChanges: AllFileChanges = {};
  for (const file of files) {
    const { content, lines } = await githubApi.getFileContent({
      owner,
      repo,
      path: file.filename,
    });
    if (lines > 500) {
      console.log(
        `Skipping file ${file.filename} as it has more than 500 lines.`
      );
      continue;
    }
    const { changes, placements } = await githubApi.parseGitPatch(
      file.patch,
      content
    );
    const responseFileChanges: FileChange[] = [];
    for (const { id, afterChange, fileContent } of changes) {
      const response = await fetch(
        "https://mocl39vmwl.execute-api.us-east-1.amazonaws.com/develop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileContent, changeBlock: afterChange }),
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to analyze the file");
      }
      const { code, comment } = await response.json();
      const fileChanges: FileChange = { id, code, comment };
      responseFileChanges.push(fileChanges);
    }

    allFileChanges[file.filename] = responseFileChanges;

    const commitShas = await githubApi.getPRCommits({
      owner,
      repo,
      pullNumber,
    });

    if (commitShas.length === 0) {
      throw new Error("No commits found in this PR.");
    }
    const latestCommitHash = commitShas[commitShas.length - 1];
    console.log(`Latest commit hash: ${latestCommitHash}`);

    Object.entries(allFileChanges).forEach(([filename, fileChanges]) => {
      fileChanges.forEach(async ({ id, code }) => {
        const filePlacement = placements.find((p) => p.id === id);
        console.log("filePlacement", filePlacement);
        console.log("code", code);
        console.log("filename", filename);
        if (!filePlacement) {
          throw new Error("File placement not found");
        }
        if (code === "" || !code) {
          return;
        }
        const body = `\`\`\`suggestion\n${code}`;
        const startLine = filePlacement.lineToAddComment;
        const line = startLine + filePlacement?.commentLength - 1;
        await githubApi.postCommitComment({
          owner,
          repo,
          commitSha: latestCommitHash,
          pullNumber,
          body,
          filePath: filename,
          line,
          startLine,
        });
      });
    });
  }
};
