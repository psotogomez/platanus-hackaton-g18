"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  meaningfulVariableNames: z.boolean().optional(),
  codeSecurityBreaches: z.boolean().optional(),
  prompt: z.string().optional(),
});

export type PullRequestReviewConfigurationFormValues = z.infer<
  typeof formSchema
>;

export const WithPullRequestReviewConfigurationForm = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const form = useForm<PullRequestReviewConfigurationFormValues>({
    resolver: zodResolver(formSchema),
  });

  return <FormProvider {...form}>{children}</FormProvider>;
};
