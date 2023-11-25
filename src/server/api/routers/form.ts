import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const formRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.form.findMany({
      orderBy: { createdAt: "desc" },
      where: { createdBy: ctx.session.user.id },
    });
  }),
  
  createStaticForm: protectedProcedure
  .input(z.object({ name: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    const name = input.name || 'Static Form'; // Use the provided name or a default value

    const form = await ctx.db.form.create({
      data: {
        createdBy: ctx.session.user.id,
        name: name,
      }
    });

    const formSection = await ctx.db.formSection.create({
      data: {
        sectionOrder: 1, // You may set the order as needed
        sectionName: 'New Section',
        sectionDesc: 'New Section Description',
        formFk: { connect: { formId: form.formId } }, // Connect to the previously created Form
      },
    });

    const formField1 = await ctx.db.formField.create({
      data: {
        label: 'Name', // Set the label as needed
        type: 'TEXT', // Set the type as needed
        required: true, // Set the required status as needed
        order: 1, // Set the order as needed
        formSectionFk: { connect: { sectionId: formSection.sectionId } }, // Connect to the previously created FormSection
      },
    });

    const formField2 = await ctx.db.formField.create({
      data: {
        label: 'Email', // Set the label as needed
        type: 'EMAIL', // Set the type as needed
        required: true, // Set the required status as needed
        order: 2, // Set the order as needed
        formSectionFk: { connect: { sectionId: formSection.sectionId } }, // Connect to the previously created FormSection
      },
    });

    return form;
  }),

  submitStaticForm: protectedProcedure
  .input(z.object({ formId: z.string(), username: z.string().min(2), email: z.string().email() }))
  .mutation(async ({ ctx, input }) => {
    const formId = input.formId; 
    const username = input.username;
    const email = input.email;

    const formResponse = await ctx.db.formResponse.create({
      data: {
        submittedBy: ctx.session.user.id,
        formId: formId,
      }
    });

    const formAnswer1 = await ctx.db.formAnswer.create({
      data: {
        answer: { username },
        fieldFk: { connect: { fieldId: "clpd2rugr000222cxb7jnhu27" } },
        responseFk: { connect: { responseId: formResponse.responseId } },
      },
    });

    const formAnswer2 = await ctx.db.formAnswer.create({
      data: {
        answer: { email },
        fieldFk: { connect: { fieldId: "clpd2ruk2000322cx3d0if1lu" } },
        responseFk: { connect: { responseId: formResponse.responseId } },
      },
    });

    return formResponse;
  }),

  deleteStaticForm: protectedProcedure
  .input(z.object({ formId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { formId } = input;

    try {
      const form = await ctx.db.form.findUnique({
        where: { formId },
        include: {
          formSection: {
            include: {
              FormField: {
                include: {
                  optionsId: true,
                },
              },
            },
          },
          responses: true, // Include any other related models here
        },
      });

      if (!form) {
        return {
          success: false,
          error: 'Form not found',
        };
      }

      // Use a transaction to delete records
      const result = await ctx.db.$transaction([
        ctx.db.formFieldOptions.deleteMany({
          where: {
            fieldId: {
              in: form.formSection
                .flatMap((section) =>
                  section.FormField.map((field) => field.optionsId?.fieldId)
                )
                .filter((fieldId) => fieldId != undefined) as string[],
            },
          },
        }),
        ctx.db.formAnswer.deleteMany({
          where: {
            responseId: {
              in: form.responses.map((response) => response.responseId),
            },
          },
        }),
        ctx.db.formResponse.deleteMany({
          where: {
            formId,
          },
        }),
        ctx.db.formField.deleteMany({
          where: {
            sectionId: {
              in: form.formSection.map((section) => section.sectionId),
            },
          },
        }),
        ctx.db.formSection.deleteMany({
          where: {
            formId,
          },
        }),
        ctx.db.form.delete({
          where: {
            formId,
          },
        }),
      ]);

      return {
        success: true,
        message: 'Form and associated records deleted successfully',
        deletedForm: result,
      };
    } catch (error) {
      console.error('Error deleting form:', error);
      return {
        success: false,
        error: 'Internal Server Error',
      };
    }

    // const result = await ctx.db.$transaction([
    //   ctx.db.formFieldOptions.deleteMany({
    //     where: {
    //       fieldId matches the fieldId of formField deleted
    //     },
    //   }),
    //   ctx.db.formField.deleteMany({
    //     where: {
    //       sectionId matches the sectionId of formSection deleted 
    //     },
    //   }),
    //   ctx.db.formSection.deleteMany({
    //     where: { formId: formId },
    //   }),
    //   ctx.db.form.delete({
    //     where: { formId: formId },
    //   }),
    // ])
    // return result;
  }),

});
