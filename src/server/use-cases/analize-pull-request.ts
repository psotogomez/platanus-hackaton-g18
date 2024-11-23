import { GithubApi } from "../external-services/github-api";
import { IPullRequestInfo, IModelResponse, ICodeChange } from "../../interfaces/IPullRequest";

export const analyzePullRequestFiles = async (props: {
  owner: string;
  repo: string;
  pullNumber: string;
  prompt?: string;
}) => {
  const { owner, repo, pullNumber, prompt } = props;
  const githubApi = new GithubApi();
  const pullRequestInfo : IPullRequestInfo = {};

  const files = await githubApi.getPRFiles({ owner, repo, pullNumber });
  console.log(`Retrieved ${files.length} files from PR #${pullNumber}`);
  for (const file of files) {
    const completeFileContext = await githubApi.getFileContent({
      owner,
      repo,
      path: file.filename,
    });
    const { changes, placement } = await githubApi.parseGitPatch(file.patch, completeFileContext);
    pullRequestInfo[file.filename] = { changes, instructions: prompt as string };
    

    const modelResponse : IModelResponse = {};
    // TODO: Send the content to the LLM and get the body
    // TODO: get the commit sha and the start line and line from the file

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

    Object.entries(modelResponse).forEach(([filename, changes ]) => {
      changes.forEach(async ({id, explanation, newCode}) => {
        const body = `\`\`\`suggestion\n${newCode}`;
        const startLine = placement[id].lineToAddComment;
        const line = startLine + placement[id].commentLength - 1;
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
