import { GithubApi } from "../external-services/github-api";

export const analyzePullRequestFiles = async (props: {
  owner: string;
  repo: string;
  pullNumber: string;
}) => {
  const { owner, repo, pullNumber } = props;

  const githubApi = new GithubApi();

  const files = await githubApi.getPRFiles({ owner, repo, pullNumber });
  console.log(`Retrieved ${files.length} files from PR #${pullNumber}`);
  for (const file of files) {
    console.log(`Fetching content for file: ${file.filename}`);
    console.log("fileSha", file.sha);
    const content = await githubApi.getFileContent({
      owner,
      repo,
      path: file.filename,
    });

    console.log(`File content: ${content}`);

    // TODO: Send the content to the LLM and get the body

    const body = "```suggestion\n" + "chaochao" + "\n```";

    // TODO: get the commit sha and the start line and line from the file

    const commitShas = await githubApi.getPRCommits({
      owner,
      repo,
      pullNumber,
    });

    if (commitShas.length === 0) {
      throw new Error("No commits found in this PR.");
    }

    // Get the latest commit hash
    const latestCommitHash = commitShas[commitShas.length - 1];
    console.log(`Latest commit hash: ${latestCommitHash}`);

    const startLine = 13;
    const line = 15;

    await githubApi.postCommitComment({
      owner,
      repo,
      commitSha: latestCommitHash,
      pullNumber,
      body,
      filePath: file.filename,
      line,
      startLine,
    });
  }
};
