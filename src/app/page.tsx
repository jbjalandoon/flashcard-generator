import { FlashCardForm } from "./_components/flashcard-form";

export default async function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center gap-3 px-4">
      <div className="mb-10 flex w-full flex-col gap-2">
        <h1 className="text-4xl font-medium">Flashcard Generator</h1>
        <p className="text-muted-foreground text-xl">
          Flashcard Generator harnesses AI to turn your notes, documents, or
          even lecture transcripts into ready-to-study flashcards in seconds.
        </p>
      </div>
      <FlashCardForm />
    </div>
  );
}
