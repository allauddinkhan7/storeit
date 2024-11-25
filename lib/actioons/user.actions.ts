//create account flow

"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
// import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
// import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";


const creatAccount = async({fullname,  email}: {fullname: string, email: string}) => {
    const existingUser = await getUserByEmail(email);
}




