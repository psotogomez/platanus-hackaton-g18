import { DummyExternalService } from "../external-services/dummy";

export const dummyUseCase = async () => {
  const dummyExternalService = new DummyExternalService();

  const pullRequests = await dummyExternalService.getPullRequestReviews();

  return pullRequests;
};
