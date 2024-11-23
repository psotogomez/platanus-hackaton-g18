import { PullRequestReviewConfigurationFormValues } from "../_components/with-pull-request-review-configuration-form";

const DEFAULT_BODY = {
  owner: "{{ github.repository_owner }}",
  repo: "{{ github.event.repository.name }}",
  pullNumber: "{{ github.event.pull_request.number }}",
};

export const createGithubActionCode = (
  data: PullRequestReviewConfigurationFormValues
) => {
  const body = {
    ...DEFAULT_BODY,
    ...data,
  };

  const apiUrl = process.env.NEXT_PUBLIC_PULL_REQUEST_REVIEW_API_URL;
  const apiKey = process.env.NEXT_PUBLIC_PULL_REQUEST_REVIEW_API_KEY;

  return `name: Peer Rhino Automatic Pull Request Review

on:\n
  pull_request:\n
    types:\n
      - opened\n
jobs:\n
  post-request:\n
    runs-on: ubuntu-latest\n
    steps:\n
    - name: Checkout Code\n
      uses: actions/checkout@v3\n
    - name: Post PR Details\n
      env:\n
        API_URL: \"$\"${apiUrl}\"\n
        API_KEY: \"$\"${apiKey}\"\n
        REPO_OWNER: \"$\"{{ github.repository_owner }}\"\n
        REPO_NAME: \"$\"{{ github.event.repository.name }}\"\n
        PR_NUMBER: \"$\"{{ github.event.pull_request.number }}\"\n
      run: |
        echo "Posting PR details to endpoint..."
        curl -X POST "$API_URL" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $API_KEY" \
          -d "${JSON.stringify(body)}"
`;
};
