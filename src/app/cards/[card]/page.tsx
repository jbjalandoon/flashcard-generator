import Link from "next/link";
import { Cards } from "~/app/_components/card";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";

export default async function Home({
  params,
}: {
  params: Promise<{ card: number }>;
}) {
  const { card } = await params;

  const flashcard = await api.flashcard.getFlashCard(Number(card));

  if (!flashcard) {
    // TODO 404 Page
    return (
      <div className="fixed top-0 z-998 flex h-screen w-full flex-col items-center justify-center bg-black/70">
        <span>404 - Page not found</span>
        <Link href={"/cards"}>Go Back</Link>
      </div>
    );
  }

  return (
    <div className="container flex flex-col gap-3 px-4">
      <h1 className="text-2xl font-medium">{flashcard.title}</h1>
      <div className="flex gap-3">
        {flashcard.subjects.map(({ subject }) => (
          <Badge className="text-xs" key={`${subject}`}>
            {subject}
          </Badge>
        ))}
      </div>
      <Cards cards={flashcard.cards} />
    </div>
  );
}
