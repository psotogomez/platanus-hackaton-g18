"use client";

import { useFormContext } from "react-hook-form";

import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  YamlTextBox,
} from "@/ui/components";
import { PullRequestReviewConfigurationFormValues } from "./with-pull-request-review-configuration-form";
import { H4 } from "@/ui/components/typography";
import { useState } from "react";
import { createGithubActionCode } from "../_helpers/create-github-action-code";
import { Loader2 } from "lucide-react";

export function PullRequestReviewConfigurationForm() {
  const [githubActionCode, setGithubActionCode] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const form = useFormContext<PullRequestReviewConfigurationFormValues>();

  const onGenerateGithubActionCode = (
    data: PullRequestReviewConfigurationFormValues
  ) => {
    setIsLoading(true);
    const code = createGithubActionCode(data);

    setTimeout(() => {
      setGithubActionCode(code);
      setIsLoading(false);
    }, 1500);
  };

  const onSubmit = (data: PullRequestReviewConfigurationFormValues) => {
    onGenerateGithubActionCode(data);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-24">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : githubActionCode ? (
        <YamlTextBox
          title="GitHub Action YAML file"
          description="Copy and paste this code into your GitHub Action YAML file"
          stringCode={githubActionCode}
        />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-4"
          >
            <H4 className="text-center w-full">
              Create your custom GitHub Action YAML file
            </H4>
            <FormField
              control={form.control}
              name="meaningfulVariableNames"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Review meaningful variable names</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codeSecurityBreaches"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Review code security breaches</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Do you want to review other details of the code?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="E.g. Check that all the colors are hex values"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create</Button>
          </form>
        </Form>
      )}
    </>
  );
}
