import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { SLUG_TO_TYPE } from "$lib/exams";

export const load: PageLoad = ({ params }) => {
  const examType = SLUG_TO_TYPE[params.exam];
  if (!examType) error(404, "Unknown exam type");
  return { examType };
};
