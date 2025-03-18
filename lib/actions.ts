"use server";

import { z } from "zod";
import prisma from "./prisma";
import { redirect } from "next/navigation";
export interface CreateEventFormData {
  title: string;
  description?: string;
  name: string;
  allowOthersToViewResults: boolean;
  allowOthersToPropose: boolean;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof CreateEventFormData]?: string[];
  };
}

const newEventSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  allowOthersToViewResults: z.boolean(),
  allowOthersToPropose: z.boolean(),
});

export async function createEvent(
  prevState: ActionResponse | null,
  formData: FormData,
  dates: Date[]
): Promise<ActionResponse | undefined> {
  let redirectUrl: string | null = null;

  try {
    const validatedFields = newEventSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      name: formData.get("name"),
      allowOthersToViewResults: formData.get("allowOthersToViewResults") === "on",
      allowOthersToPropose: formData.get("allowOthersToPropose") === "on",
    });

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return {
        success: false,
        message: "Please fix the errors in the form",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { title, description, name, allowOthersToViewResults, allowOthersToPropose } = validatedFields.data;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        allowOthersToViewResults,
        allowOthersToPropose,
        users: {
          create: {
            name,
            isCreator: true,
            availableDates: dates,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    redirectUrl = `/event/results/${event.users[0].id}`;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error creating event",
    };
  } finally {
    if (redirectUrl) {
      redirect(redirectUrl);
    }
  }
}
