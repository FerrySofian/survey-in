import { useState } from "react";

import {
  Flex,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";

import CheckboxButtonGroup from "@/components/elements/CheckboxCard";
import NeedsCard from "@/components/fragments/NeedsCard";
import LoaderOverlay from "@/components/elements/LoaderOverlay";

// Calling React Query And All Data in Needs
import { dataUI } from "@/types/api.types";
import { useReligionList } from "@/services/religion";
import { useLocationList } from "@/services/location";

export default function RespondentDetailBasicComponent() {
  const [show, setShow] = useState(false);

  const { isLoading: isLoadingReligion, data: religionList } =
    useReligionList();
  const { isLoading: isLoadingLocation, data: locationList } =
    useLocationList();

  return (
    <Flex direction="column" gap="23px">
      <LoaderOverlay isLoading={isLoadingReligion || isLoadingLocation} />
      <NeedsCard title={"Gender"}>
        <CheckboxButtonGroup
          name={"respondent-type"}
          defaultValue={[""]}
          options={["male", "female"]}
          onChange={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
        />
      </NeedsCard>
      <NeedsCard title={"Status Pernikahan"}>
        <CheckboxButtonGroup
          name={"marital-status"}
          defaultValue={[""]}
          options={["belum menikah", "sudah menikah"]}
          onChange={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
        />
      </NeedsCard>
      <NeedsCard title={"Age"}>
        <Flex justifyContent="space-between" w="100%" direction="column">
          <Text>
            Between {range[0]} and {range[1]}
          </Text>
        </Flex>
        <RangeSlider
          //   eslint-disable-next-line jsx-a11y/aria-proptypes
          aria-label={["min", "max"]}
          min={17}
          max={100}
          defaultValue={[19, 25]}
          onChange={setRange}
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
          name={"religion"}
          defaultValue={[""]}
          options={religionList?.data?.map((val: dataUI) => val.name) ?? []}
          onChange={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
        />
      </NeedsCard>
      <NeedsCard title={"Lokasi"}>
        <CheckboxButtonGroup
          name={"location"}
          defaultValue={[""]}
          options={locationList?.data?.map((val: dataUI) => val.name) ?? []}
          onChange={function (value: any): void {
            throw new Error("Function not implemented.");
          }}
        />
      </NeedsCard>
    </Flex>
  );
}
