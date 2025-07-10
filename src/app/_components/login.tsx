"use client";

import { Button } from "~/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

export function GoogleLogin() {
  const session = useSession();

  const deleteGoogleAccount = api.auth.deleteGoogleAccount.useMutation({
    onSuccess: async (success) => {
      if (success) {
        await signOut({
          callbackUrl: "/",
          redirect: true,
        });
      } else {
        alert("Something went wrong in deleting your account, try again");
      }
    },
  });

  return (
    <>
      {session.data ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="border-none outline-none">
            <Avatar className="aspect-square h-12 w-12 cursor-pointer">
              <AvatarImage src={session.data.user.image!} />
              <AvatarFallback>{session.data.user.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-1000">
            <DropdownMenuLabel>{session.data.user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Dialog>
                <DialogTrigger className="h-full w-full cursor-pointer text-left">
                  Delete Account
                </DialogTrigger>
                <DialogContent
                  onEscapeKeyDown={(event) => {
                    event.preventDefault();
                  }}
                  onPointerDownOutside={(event) => {
                    event.preventDefault();
                  }}
                  className="[&>button:last-child]:hidden"
                >
                  <DialogHeader className="flex flex-col gap-5">
                    <DialogTitle>
                      Are you sure you want to delete your account?
                    </DialogTitle>
                    <DialogDescription>
                      <div className="flex gap-3">
                        <Button
                          variant={"destructive"}
                          onClick={() => {
                            deleteGoogleAccount.mutate();
                          }}
                          className="cursor-pointer"
                          disabled={deleteGoogleAccount.isPending}
                        >
                          {deleteGoogleAccount.isPending ? "Deleting" : "Yes"}
                        </Button>
                        <DialogClose
                          asChild
                          className="cursor-pointer"
                          disabled={deleteGoogleAccount.isPending}
                        >
                          <Button>No</Button>
                        </DialogClose>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await signOut({
                  callbackUrl: "/",
                  redirect: true,
                });
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant={"default"}
          className="cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Login
        </Button>
      )}
    </>
  );
}
