import { callAPI } from "@/services/api";
import {
  QuestionnaireResponseUI,
  QuestionnaireUI,
} from "../../types/questionnaire";
import { useMutation, useQuery } from "@tanstack/react-query";

// USERS

export const getQuestionnaireList = async ({
  search,
  startDate,
  endDate,
  status,
  userId,
}: {
  search?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string;
  userId?: string;
}) => {
  const params: any = {};

  if (search) params.search = search;
  if (startDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  if (status) params.status = status;
  if (userId) params["user-id"] = userId;

  const res = await callAPI({
    path: `/questionnaire`,
    params: params,
    method: "GET",
  });

  return res.data;
};

export const getQuestionnaireDetail = async (questionnaireId: string) => {
  const res = await callAPI({
    path: `/questionnaire/${questionnaireId}`,
    method: "GET",
  });

  return res.data;
};

export const postQuestionnaire = async (data: any, userId: any) => {
  return await callAPI({
    path: `/questionnaire?user-id=${userId}`,
    method: "POST",
    data: data,
  });
};

export const putQuestionnaireUpdateStatus = async (
  data: any,
  questionnaireId: any
) => {
  return await callAPI({
    path: `/questionnaire/${questionnaireId}/status`,
    method: "PUT",
    data: data,
  });
};

export const getGoogleFormTitle = async (googleFormUrl: string) => {
  const res = await callAPI({
    path: `/get-google-form-title?url=${googleFormUrl}`,
    method: "GET",
  });

  return res.data;
};

export const useQuestionnaireList = ({
  search,
  startDate,
  endDate,
  status,
  userId,
}: {
  search?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  status?: string;
  userId?: string;
}) => {
  return useQuery<QuestionnaireResponseUI>({
    queryKey: ["questionnaire", search, startDate, endDate, status, userId],
    queryFn: () =>
      getQuestionnaireList({ search, startDate, endDate, status, userId }),
    keepPreviousData: false,
  });
};

export const useQuestionnaireDetail = (questionnaireId: string) => {
  return useQuery<QuestionnaireUI>({
    queryKey: ["questionnaire-detail"],
    queryFn: () => getQuestionnaireDetail(questionnaireId ?? ""),
    keepPreviousData: false,
  });
};

// export const useCalonSiswaQuery = (id: string | undefined) =>
//     useMutation(['calon-siswa'], async (body: UserBodyRequest<typeof id>) => {
//         const res = await putCalonSiswaUpdate(body as UserCustomerPutUI, id)
//         return res;
//     });
