import { GithubApi } from "../external-services/github-api";
import { AllFileChanges, FileChange } from "../../interfaces/IPullRequest";
import invokeModel from "../external-services/bedrock";

export const analyzePullRequestFiles = async (props: {
  owner: string;
  repo: string;
  pullNumber: string;
  branchName: string;
  prompt?: string;
}) => {
  const { owner, repo, pullNumber, branchName, prompt } = props;
  const githubApi = new GithubApi();

  const files = await githubApi.getPRFiles({ owner, repo, pullNumber });
  const allFileChanges : AllFileChanges = {};
  for (const file of files) {
    console.log(`Analyzing file ${file.filename}`);
    const { content, lines } = await githubApi.getFileContent({
      owner,
      repo,
      path: file.filename,
      branch: branchName,
    });
    if (lines > 500) {
      console.log(`Skipping file ${file.filename} as it has more than 500 lines.`);
      continue;
    }
    const { changes, placements } = await githubApi.parseGitPatch(file.patch, content);
    const responseFileChanges: FileChange[] = [];
    for (const { id, afterChange, fileContent } of changes) {
      const response = await invokeModel(prompt || '', fileContent, afterChange);
      if (response) {
        const { code, comment } = response;
        console.log(`Code: ${code}`);
        console.log(`Comment: ${comment}`);
        console.log("content", fileContent);
        console.log("afterChange", afterChange);
        const fileChanges: FileChange = { id, code, comment };
        responseFileChanges.push(fileChanges);
      }
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

    Object.entries(allFileChanges).forEach(([filename, fileChanges ]) => {
      fileChanges.forEach(async ({id, code, comment}) => {
        const filePlacement = placements.find((p) => p.id === id);
        if (!filePlacement) {
          throw new Error("File placement not found");
        } if (code === '' || !code) {
          return;
        }
        console.log(`Adding comment to file ${filename}`);
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
