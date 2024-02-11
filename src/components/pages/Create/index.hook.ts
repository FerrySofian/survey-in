import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import emailjs from "@emailjs/browser";

import { FormValue, ProcessEnvConstants } from "./index.types";

import { googleFormsToJson } from "react-google-forms-hooks";

import { RespondentPostUI } from "@/types/questionnaire";
import { postQuestionnaire } from "@/services/questionnaire";

import { useAuthStore } from "@/stores/auth";

import { lower } from "case";

export default function useCreate() {
  const [isFormShown, setShowForm] = useState(false);
  const [isURLSubmitted, setURLSubmitted] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [formTitle, setFormTitle] = useState("Survey");
  const [pricing, setPricing] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [respondentDetail, setRespondentDetail] =
    useState<RespondentPostUI | null>(null);
  const [lastChangedAdvanced, setLastChangedAdvanced] = useState<string | null>(
    null
  );

  const handleShowForm = () => setShowForm(true);
  const handleHideForm = () => setShowForm(false);
  const resetUrl = () => setSubmittedUrl("random");

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedUrl(
      (event.target as typeof event.target & FormValue).url.value
    );
  };

  const sendEmail = async () => {
    try {
      const result = await googleFormsToJson(submittedUrl);

      setFormTitle(result.title);

      setTabIndex(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePay = async (router: any) => {
    try {
      const { currentUser } = useAuthStore.getState();

      const payload = {
        ...respondentDetail,
        questionnaire_url: submittedUrl,
        questionnaire_title: formTitle,
        questionnaire_total_price: pricing,
        created_by_name: currentUser?.displayName,
      };

      console.log(currentUser?.uid);
      const result = await postQuestionnaire(payload, currentUser?.uid);
      router.push(
        `/questionnaire/${result.data.data.id}${
          respondentDetail?.segmented_type === "request-segment"
            ? "/order-in-review"
            : ""
        }`
      );
    } catch (error) {}
  };

  const disabledCheckoutButton = useMemo(() => {
    if (tabIndex > 0) {
      if (!!respondentDetail) {
        if (respondentDetail.respondent_qty < 1) return true;
        if (!respondentDetail.respondent_type) {
          return true;
        } else {
          if (respondentDetail.respondent_type === "segmented") {
            if (!respondentDetail.segmented_type) {
              return true;
            } else {
              if (
                respondentDetail.segmented_type === "basic" &&
                !!respondentDetail.segmented_basic_detail
              )
                return false;
              if (
                respondentDetail.segmented_type === "advanced" &&
                !!respondentDetail.segmented_advanced_detail
              )
                return false;
              return true;
            }
          }
          return false;
        }
      }
      return true;
    }
    return false;
  }, [respondentDetail, tabIndex]);

  return {
    isFormShown,
    isURLSubmitted,
    submittedUrl,
    onShowForm: handleShowForm,
    onHideForm: handleHideForm,
    onSubmitForm: handleSubmitForm,
    onSubmitURL: sendEmail,
    onCancelSubmitURL: resetUrl,
    tabIndex,
    setTabIndex,
    handleTabsChange,
    respondentDetail,
    setRespondentDetail,
    handlePay,
    pricing,
    setPricing,
    disabledCheckoutButton,
    lastChangedAdvanced,
    setLastChangedAdvanced,
  };
}
