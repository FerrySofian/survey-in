import { callAPI } from "@/services/api";
import {
  OrderResponseUI,
  OrderUI,
  OrderPostUI,
  OrderDetailUI,
} from "../../types/order";
import { useMutation, useQuery } from "@tanstack/react-query";

// USERS

export const getOrderList = async ({ userId }: { userId: string }) => {
  const res = await callAPI({
    path: `/order`,
    params: { "user-id": userId },
    method: "GET",
  });

  return res.data;
};

export const getOrderDetail = async (questionnaireId: string) => {
  const res = await callAPI({
    path: `/order`,
    params: { "questionnaire-id": questionnaireId },
    method: "GET",
  });

  return res.data;
};

export const postOrder = async (data: any, userId: any) => {
  return await callAPI({
    path: `/order?user-id=${userId}`,
    method: "POST",
    data: data,
  });
};

export const useOrderList = ({
  userId,
  questionnaireId,
}: {
  userId?: string;
  questionnaireId?: string;
}) => {
  return useQuery<OrderResponseUI>({
    queryKey: ["order", userId, questionnaireId],
    queryFn: () =>
      getOrderList({
        userId: userId ?? "",
      }),
    keepPreviousData: false,
  });
};

export const useOrderDetail = (questionnaireId: string) => {
  return useQuery<OrderDetailUI>({
    queryKey: ["order-detail"],
    queryFn: () => getOrderDetail(questionnaireId ?? ""),
    keepPreviousData: false,
    retry: 1,
  });
};

export const useOrderQuery = (id: string | undefined) =>
  useMutation(["order"], async (body: OrderPostUI) => {
    const res = await postOrder(body as OrderPostUI, id);
    return res;
  });
