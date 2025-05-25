"use server";
import { createAdminClient } from "../appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFiles = async ({
  file,
  ownerId, //who created this File
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name); //read the file
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      //we want this meta data along with file and store it appwrite db
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to Upload file");
  }
};

const createQueries = (currentUser:Models.Document) => {
  const queries = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email])

    ])
  ];

  //TODO: Search, sort, limits...

  return queries

}


export const getFiles = async () => {
  const {databases} = await createAdminClient(); //access appwrite databases functionality
  try {
    //we want file based on many different criteria 
    //criteria 1:  user currently logged in we will only show the files that user have accesss to 
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("no user found");
    //form different queries for our criterias 
    const queries = createQueries(currentUser)
    console.log({currentUser, queries})
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );
    console.log({files})
    return parseStringify(files)
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};



export const renameFile = async ({fileId,name,extension,path}: RenameFileProps) => {
  const {databases} = await createAdminClient();
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      }
    );
    revalidatePath(path)
  } catch (error) {
    handleError(error, "Failed to rename file")
  }
}


//updateFileUsers
export const updateFileUsers = async ({ fileId, emails, path} : UpdateFileUsersProps) => {
  console.log("updateFileUsers")
}

//deleteFile
export const deleteFile = async ({fileId,  bucketFileId, path} : DeleteFileProps) => {
  console.log("deleteFile")
}
