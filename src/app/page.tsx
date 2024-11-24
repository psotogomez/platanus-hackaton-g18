"use client";

import { WithPullRequestReviewConfigurationForm } from "./_components/with-pull-request-review-configuration-form";
import { PullRequestReviewConfigurationForm } from "./_components/pull-request-review-configuration-form";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  Button,
} from "@/ui/components";
import Image from "next/image";
import Logo from "@/public/assets/peer-rihno.png";
import { H1, H3, H4, P } from "@/ui/components/typography";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <div className="relative size-full min-h-screen overflow-hidden bg-[#4a5166]">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#6b7285] to-[#3d4354]"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-l from-[#8e97b5] to-[#5a6275] opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-[#c2c8de] to-[#6b7285] opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[#4a5166] opacity-10 mix-blend-multiply" />
      <div className="relative z-10 flex flex-col size-full items-center justify-center">
        <div className="flex flex-row h-24 w-full bg-background p-4">
          <div className="flex flex-row items-center justify-center gap-2">
            <Image
              src={Logo}
              alt="logo"
              width={60}
              height={60}
              className="object-contain rounded-full"
            />
            <div className="flex flex-col">
              <H4>Peer Rihno</H4>
              <P>Your code partner</P>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 items-center justify-center max-w-7xl gap-12 py-16 md:pt-40 px-8">
          <div className="flex flex-col w-full gap-8">
            <H1 className="text-center !text-background">
              Elevate your code quality with{" "}
              <span className="text-dark">automated pull request</span> reviews
              powered by AI.
            </H1>
            <H3 className="text-center !text-background font-normal">
              Seamlessly integrated with GitHub Actions, our tool ensures{" "}
              <span className="font-bold text-dark">
                every PR gets the attention it deserves
              </span>
              —without waiting on busy team members.
            </H3>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full h-12 w-40">Start</Button>
              </DialogTrigger>
              <DialogContent>
                <WithPullRequestReviewConfigurationForm>
                  <PullRequestReviewConfigurationForm />
                </WithPullRequestReviewConfigurationForm>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" className="rounded-full h-12 w-40">
              <Github className="w-4 h-4" />
              Our Repo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
