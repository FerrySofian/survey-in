import { useState } from "react";

import {
  Flex,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";

import { RespondentDetailBasicComponentProps } from "./index.types";

import CheckboxButtonGroup from "@/components/elements/CheckboxCard";
import NeedsCard from "@/components/fragments/NeedsCard";
import LoaderOverlay from "@/components/elements/LoaderOverlay";

// Calling React Query And All Data in Needs
import { dataUI } from "@/types/api.types";
import { useReligionList } from "@/services/religion";
import { useLocationList } from "@/services/location";

export default function RespondentDetailBasicComponent({
  watch,
  setValue,
}: RespondentDetailBasicComponentProps) {
  const [range, setRange] = useState<number[]>([19, 25]);

  const { isLoading: isLoadingReligion, data: religionList } =
    useReligionList();
  const { isLoading: isLoadingLocation, data: locationList } =
    useLocationList();

  return (
    <Flex direction="column" gap="23px">
      <LoaderOverlay isLoading={isLoadingReligion || isLoadingLocation} />
      <NeedsCard title={"Gender"}>
        <CheckboxButtonGroup
          name={"segmented_basic_detail.gender"}
          options={["male", "female"]}
          value={watch("segmented_basic_detail.gender")}
          onChange={(val) => setValue("segmented_basic_detail.gender", val)}
        />
      </NeedsCard>
      <NeedsCard title={"Status Pernikahan"}>
        <CheckboxButtonGroup
          name={"segmented_basic_detail.marital_status"}
          options={["belum menikah", "sudah menikah"]}
          value={watch("segmented_basic_detail.marital_status")}
          onChange={(val) =>
            setValue("segmented_basic_detail.marital_status", val)
          }
        />
      </NeedsCard>
      <NeedsCard title={"Age"}>
        <Flex justifyContent="space-between" w="100%" direction="column">
          <Text>
            Between {watch('segmented_basic_detail.age.0') ?? 0} and {watch('segmented_basic_detail.age.1') ?? 0}
          </Text>
        </Flex>
        <RangeSlider
          //   eslint-disable-next-line jsx-a11y/aria-proptypes
          aria-label={["min", "max"]}
          name={"segmented_basic_detail.age"}
          min={17}
          max={100}
          defaultValue={[19, 25]}
          onChange={(val) => setValue("segmented_basic_detail.age", val)}
          h="20px"
          ml="8px"
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </NeedsCard>
      <NeedsCard title={"Agama"}>
        <CheckboxButtonGroup
          name={"segmented_basic_detail.religion"}
          options={religionList?.data?.map((val: dataUI) => val.name) ?? []}
          value={watch("segmented_basic_detail.religion")}
          onChange={(val) => setValue("segmented_basic_detail.religion", val)}
        />
      </NeedsCard>
      <NeedsCard title={"Lokasi"}>
        <CheckboxButtonGroup
          name={"segmented_basic_detail.location"}
          options={locationList?.data?.map((val: dataUI) => val.name) ?? []}
          value={watch("segmented_basic_detail.location")}
          onChange={(val) => setValue("segmented_basic_detail.location", val)}
        />
      </NeedsCard>
    </Flex>
  );
}
