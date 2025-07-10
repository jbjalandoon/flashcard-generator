import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import { api } from "~/trpc/server";

export default async function Cards({
  searchParams,
}: {
  searchParams: Promise<{ page: 1; perPage: 15 }>;
}) {
  const params = await searchParams;
  const page = params.page ?? 1;
  const perPage = params.perPage ?? 15;

  if (page < 1) {
    redirect("/cards");
  }

  const flashcards = await api.flashcard.getFlashCards({
    page: Number(page),
    pageSize: Number(perPage),
  });

  return (
    <div className="container mx-auto flex flex-col items-start gap-5 px-5">
      <h1 className="text-2xl font-medium">Generated Flashcards</h1>
      {flashcards.data.length < 1 ? (
        <>
          <div className="flex h-24 w-full items-center justify-center text-center text-2xl">
            No flashcard has been generated yet.
          </div>
        </>
      ) : (
        <>
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flashcards.data.map((el) => (
              <Link href={`cards/${el.id}`} key={el.id}>
                <Card className="flex w-full flex-col items-center justify-center gap-1 border">
                  <span className="text-xl">{el.title}</span>
                  <span className="text-muted-foreground text-sm">
                    {el.cards.length} Flashcards
                  </span>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                    {el.subjects.map(({ subject }) => (
                      <Badge className="text-xs" key={`${el.id}-${subject}`}>
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
      {flashcards.data.length > 0 && (
        <Pagination>
          <PaginationContent>
            {flashcards.page !== 1 && (
              <>
                <PaginationItem>
                  <PaginationLink href={`/cards?page=${flashcards.page - 1}`}>
                    {flashcards.page - 1}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationLink isActive>{flashcards.page}</PaginationLink>
            </PaginationItem>
            {flashcards.page < flashcards.totalPages && (
              <PaginationItem>
                <PaginationLink href={`/cards?page=${flashcards.page + 1}`}>
                  {flashcards.page + 1}
                </PaginationLink>
              </PaginationItem>
            )}
            {flashcards.page + 1 < flashcards.totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
