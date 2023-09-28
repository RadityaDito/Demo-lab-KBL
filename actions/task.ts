"use server";

import prisma from "@/lib/prisma";
import { createTaskSchemaType } from "@/schema/createTask";
import { currentUser } from "@clerk/nextjs";

export const createTask = async (data: createTaskSchemaType) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }
  //TODO:
  //Setelah dapat linknya di content
  console.log(`Link URL Asli : ${data.content}`);
  const spreadsheetUrl = data.content;

  //Pake API eriqo untuk clone sheet
  const response = await fetch(
    `http://localhost:5000/sheets/copy?spreadsheetUrl=${spreadsheetUrl}`,
    { method: "POST" }
  );

  const result = await response.json();

  console.log(`Hasil Copy : ${result.response}`);

  const { content, expiresAt, collectionId, name } = data;

  return await prisma.task.create({
    data: {
      userId: user.id,
      name: name,
      content: result.response,
      expiresAt,
      Collection: {
        connect: {
          id: collectionId,
        },
      },
    },
  });
  return;
};

export async function setTaskToDone(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.task.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      done: true,
    },
  });
}
