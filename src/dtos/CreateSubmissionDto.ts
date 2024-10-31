import { z } from 'zod';
//This is type create from the zod schema
export type CreateSubmissionDto = z.infer<typeof createSubmissionZodSchema>;
//This is the zod schema
export const createSubmissionZodSchema = z
  .object({
    userId: z.string(),
    problemId: z.string(),
    code: z.string(),
    language: z.string(),
  })
  .strict();
/*
export interface CreateSubmissionDto {
  userId: string;
  problemId: string;
  code: string;
  language: string;
}
export const createSubmissionZodSchema = z.object({
  userId: z.string(),
  problemId: z.string(),
  code: z.string(),
}).strict();
.strict() is used to ensure that the object does not have any additional properties other than the ones defined in the schema.

 */
