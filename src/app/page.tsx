"use client";

import { WithPullRequestReviewConfigurationForm } from "./_components/with-pull-request-review-configuration-form";
import { PullRequestReviewConfigurationForm } from "./_components/pull-request-review-configuration-form";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger, Button } from "@/ui/components";
import { H1, H3 } from "@/ui/components/typography";
import { Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/assets/peer-rihno.png";

export default function Home() {
  return (
    <div className="relative size-full min-h-screen overflow-hidden bg-[#7e9eff]">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#a5bae2] to-[#93aeff]"
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
          className="absolute inset-0 bg-gradient-to-l from-[#d4dfff] to-[##aeb9ce] opacity-50"
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
          className="absolute inset-0 bg-gradient-to-t from-[#2c62ff] to-[#6e93ff] opacity-30"
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
      <div className="flex flex-col h-screen w-screen items-center justify-center relative z-10">
        <div className="flex flex-col items-center justify-center max-w-7xl gap-12 px-8">
          <Image
            src={Logo}
            alt="logo"
            width={120}
            height={120}
            className="object-contain rounded-full"
          />
          <div className="flex flex-col w-full gap-8">
            <H1 className="text-center !text-background">
              Elevate your code quality with{" "}
              <span className="text-blue-700">automated pull request</span>{" "}
              reviews powered by AI.
            </H1>
            <H3 className="text-center !text-background font-normal">
              Seamlessly integrated with GitHub Actions, our tool ensures{" "}
              <span className="font-bold text-blue-700">
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
            <Link href="https://github.com/psotogomez/platanus-hackaton-g18">
              <Button variant="secondary" className="rounded-full h-12 w-40">
                <Github className="w-4 h-4" />
                Open Source ❤️
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
