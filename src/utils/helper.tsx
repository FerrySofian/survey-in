"use client";

import { title } from "case";

export function parseNumber(
  value: string,
  locales: string | string[] = "fr-FR"
): number | undefined {
  try {
    if (value && typeof value === "string") {
      const example = Intl.NumberFormat(locales).format(1.1);
      const cleanPattern = new RegExp(`[^-+0-9${example.charAt(1)}]`, "g");
      const cleaned = value.replace(cleanPattern, "");
      const normalized = cleaned.replace(example.charAt(1), ".");
      return parseFloat(normalized);
    }
  } catch (error: any) {
    console.error("Failed To Parse");
  }
}

export function currencyFormat(
  value: number | string,
  locales: Intl.LocalesArgument = "id-ID"
) {
  try {
    const lovalValue = typeof value === "string" ? parseNumber(value) : value;
    return (lovalValue as number).toLocaleString(locales);
  } catch (e: any) {
    console.error(e);
  }
}

export function formatPhoneNumber(phoneNumber: string) {
  // Add the country code prefix if it's not already present
  if (!phoneNumber.startsWith("+62")) {
    phoneNumber = "+62" + phoneNumber.replace(/^0+/, ""); // Remove leading zeros
  }

  return phoneNumber;
}

export const constructRespondentRequirement = (data: any) => {
  const objToGet =
    data.segmented_type === "basic"
      ? data.segmented_basic_detail
      : data.segmented_advanced_detail;

  return Object.entries(objToGet ?? {}).map(([key, value]) => ({
    key: title(key),
    value: value,
  }));
};

export const constructRespondentRequirementsValue = ({
  key,
  value,
  divider,
}: {
  key: string;
  value: Array<string | number>;
  divider?: string;
}) => {
  if (key === "Age") return `${value[0]} - ${value[1]}`;
  else return value.map((val) => title(val as string)).join(divider ?? ", ");
};

export const constructWAChat = ({
  phone_number,
  head,
  body,
}: {
  phone_number: string;
  head: string;
  body: string;
}) => {
  return `https://wa.me/${phone_number}?text=${head}%0D%0A${body}`;
};

export function resolveStatusColor(status: string): string {
  if (status === "on-going") return "#00ADF0";
  if (status === "in review") return "#F90";
  if (status === "cancelled") return "#F62525";
  if (status === "draft") return "#9C9C9C";
  if (status === "done") return "#3ED556";
  return "";
}

export function toDataURL(
  url: string,
  callback: (result: string | ArrayBuffer | null) => void
) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

export function convertDataURIToBinary(base64String: string) {
  let BASE64_MARKER = ";base64,";
  let base64Index = base64String.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  let base64 = base64String.substring(base64Index);
  let raw = window.atob(base64);
  let rawLength = raw.length;
  let array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}
