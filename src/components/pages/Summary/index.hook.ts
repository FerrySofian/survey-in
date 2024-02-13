import { useCallback, useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { OrderPostUI } from "@/types/order";
import { useToast } from "@chakra-ui/react";
import {
  constructRespondentRequirement,
  constructRespondentRequirementsValue,
  toDataURL,
} from "@/utils/helper";
import convertSize from "convert-size";
import dayjs from "dayjs";
import id from "dayjs/locale/id";
import { currencyFormat } from "@/utils/helper";

dayjs.locale(id);

export default function useSummary({
  setValue,
  watch,
  submitOrder,
  router,
  questionnaireId,
  questionnaireData,
}: {
  setValue: any;
  watch: any;
  submitOrder: any;
  router: any;
  questionnaireId: string | string[];
  questionnaireData: any;
}) {
  const [blobUrl, setBlobUrl] = useState<any>("");
  const toast = useToast();
  // useEffect(() => {
  //   
  // }, []);
  if (process?.env?.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) emailjs.init(process?.env?.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      const file = acceptedFiles?.[0];

      if (!file) {
        return;
      }

      // Do something with the files
      const imgUrl = URL.createObjectURL(file);
      setBlobUrl(imgUrl);
      await toDataURL(imgUrl, (img) => {
        setValue("file", img);
      });
    },
    [setValue]
  );

  const onDropRejected = useCallback(
    async (fileRejections: any) => {
      fileRejections.forEach((val: any) => {
        toast({
          title: `File size is ${convertSize(val.file.size)}.`,
          description: `The maximum size is 800kb`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      });
    },
    [toast]
  );

  const onSubmit = async (data: OrderPostUI) => {
    try {
      if (!watch("file") && !blobUrl) {
        return toast({
          title: "Failed",
          description: "File is required",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }

      const payload = {
        ...data,
        questionnaire_id: questionnaireId,
      };
      const submittedOrder = await submitOrder(payload);

      if (
        process?.env?.NEXT_PUBLIC_SERVICE_ID &&
        process?.env?.NEXT_PUBLIC_TEMPLATE
      ) {
        const createSegmnentData = constructRespondentRequirement(
          questionnaireData
        ).map(
          (val: any) =>
            `<li>${val.key}: ${constructRespondentRequirementsValue(val)}</li>`
        );
        // Kirim ke survey in & customer
        await emailjs.send(
          process.env.NEXT_PUBLIC_SERVICE_ID,
          process.env.NEXT_PUBLIC_TEMPLATE,
          {
            username: payload.full_name,
            email_to: payload.email,
            phone_number: payload.phone_number,
            order_id: submittedOrder?.data.data.id,
            created_at: dayjs().format("dddd[,] D MMMM YYYY"),
            respondent_qty: questionnaireData?.respondent_qty,
            segment: `<ul>${createSegmnentData.join("")}<ul>`,
            total_price: currencyFormat(
              questionnaireData?.questionnaire_total_price ?? 0
            ),
          }
        );
      }

      toast({
        title: "Success",
        description: "Payment proof successfully submitted",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      router.push(`/questionnaire/${questionnaireId}/order-in-review`);
    } catch (error) {
      toast({
        title: "Failed.",
        description: "Failed to post order",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      console.error(error);
    }
  };

  return {
    onDrop,
    onDropRejected,
    onSubmit,
    respondentRequirement: constructRespondentRequirement,
    respondentRequirementValue: constructRespondentRequirementsValue,
    blobUrl,
  };
}
