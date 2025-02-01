import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { signOutUser } from "@/lib/actions/user.actions";
import FileUploader from "./FileUploader";
import Search from "./Search";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} />
        {/* this is server component so we cannot use onCLick, formSubmissions*/}
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          {/* so we will use action (react 19 ) functionality that allows to perform server side functionality for seems to client side thing */}
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="sign-out-logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
