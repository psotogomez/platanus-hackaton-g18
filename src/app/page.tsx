import { H1, P } from "@/ui/components/typography";
import { WithPullRequestReviewConfigurationForm } from "./_components/with-pull-request-review-configuration-form";
import { PullRequestReviewConfigurationForm } from "./_components/pull-request-review-configuration-form";

export default function Home() {
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
    </div>
  );
}
