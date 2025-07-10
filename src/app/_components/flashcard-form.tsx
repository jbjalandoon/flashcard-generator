"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { FaCog } from "react-icons/fa";
import { Card } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { TRPCClientError } from "@trpc/client";
import { Input } from "~/components/ui/input";

export function FlashCardForm() {
  const [count, setCount] = useState<number>(5);
  const [errors, setErrors] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [inputType, setInputType] = useState<"textarea" | "photo" | "pdf">(
    "textarea",
  );
  const router = useRouter();

  const generateFlashCard = api.flashcard.generate.useMutation({
    onSuccess: async (id) => {
      router.push("/cards/" + id);
    },
    onError: async (error) => {
      try {
        const message = error.message;
        const messageJSON = JSON.parse(message) as unknown as Array<{
          message: string;
        }>;
        setErrors(messageJSON.map((el) => el.message));
      } catch {
        setErrors(["Something went wrong. Please try again."]);
      }
    },
  });

  return (
    <>
      <Card className="h-fit w-full px-5 sm:px-10">
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription className="px-3 text-base">
              <ul className="list-disc">
                {errors.map((el) => (
                  <li key={el}>{el}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            generateFlashCard.mutate({ count, content, title });
          }}
        >
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Title of your flashcard"
              value={title}
              onChange={(e) => {
                setTitle(e.currentTarget.value);
              }}
            />
            <Select
              onValueChange={(val) => {
                setCount(Number(val));
              }}
            >
              <SelectTrigger className="w-55">
                <SelectValue placeholder="Select Flashcard Count" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Flashcard Count</SelectLabel>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue="textarea" className="flex flex-col">
            <div className="flex gap-10">
              <TabsList>
                <TabsTrigger
                  value="textarea"
                  onClick={() => setInputType("textarea")}
                >
                  Text
                </TabsTrigger>
                <TabsTrigger value="pdf" onClick={() => setInputType("pdf")}>
                  PDF
                </TabsTrigger>
                <TabsTrigger
                  value="photo"
                  onClick={() => setInputType("photo")}
                >
                  Photo
                </TabsTrigger>
              </TabsList>

              {inputType === "textarea" && (
                <div className="ml-auto hidden self-end sm:inline-block">
                  {content.length} / 20000
                </div>
              )}
            </div>
            <div className="flex h-85 w-full items-center justify-center">
              <TabsContent value="textarea" className="h-full">
                <Textarea
                  placeholder="Insert your notes here"
                  className="h-full w-full resize-none overflow-auto rounded-xl bg-white p-3 outline-none"
                  value={content}
                  onChange={(e) => {
                    setContent(e.currentTarget.value);
                  }}
                />
              </TabsContent>
              <TabsContent
                value="pdf"
                className="flex h-full w-full items-center justify-center rounded-xl border border-dashed px-3"
              >
                <span className="w-fit text-center">
                  Pardon our dust! We’re putting the finishing touches on
                  something big here. Check back soon—you won’t want to miss
                  what’s coming!
                </span>
              </TabsContent>
              <TabsContent
                value="photo"
                className="flex h-full w-full items-center justify-center rounded-xl border border-dashed px-3"
              >
                <span className="w-fit text-center">
                  Pardon our dust! We’re putting the finishing touches on
                  something big here. Check back soon—you won’t want to miss
                  what’s coming!
                </span>
              </TabsContent>
            </div>
          </Tabs>
          <Button
            variant={"default"}
            className={`w-full text-base ${generateFlashCard.isPending ? "cursor-not-allowed" : "cursor-pointer"}`}
            disabled={generateFlashCard.isPending}
          >
            {generateFlashCard.isPending ? (
              <span className="mx-auto flex w-fit items-center gap-3">
                <FaCog className="animate-spin" />
                Generating
              </span>
            ) : (
              "Generate"
            )}
          </Button>
        </form>
      </Card>
    </>
  );
}
