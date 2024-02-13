"use client";

import { FormEvent, useEffect } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";

import { CustomerModal } from "./index.types";

import { postUserCreate } from "@/services/user";

import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPostUI } from "@/types/user";
import { addUserSchema } from "@/validations/user";

export function CustomerModalComponent({
  isOpen,
  onClose,
  onOpen,
  selectedData,
  setSelectedData,
}: CustomerModal) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors, isValid: isValidForm },
  } = useForm<UserPostUI>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      phone_number: "",
    },
  });

  useEffect(() => {
    if (!!selectedData) {
      setValue("email", selectedData.email);
      setValue("full_name", selectedData.displayName);
      setValue("phone_number", selectedData.phone_number);
    }
  }, [selectedData, setValue]);

  const onSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await postUserCreate(getValues());
      queryClient.invalidateQueries(["user"]);
      toast({
        title: `Success`,
        description: "User created successfully",
        status: "success",
        position: "top",
        isClosable: true,
      });
      onClose();
      reset();
      setSelectedData(null);
    } catch (error) {
      toast({
        title: `Failed`,
        description: "User failed to create",
        status: "error",
        position: "top",
        isClosable: true,
      });
    }
  };

  const handleOnCloseModal = () => {
    reset();
    setSelectedData(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={handleOnCloseModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxW="45vw">
        <form onSubmit={onSubmitForm}>
          <ModalHeader px="45px">
            {!selectedData ? "Register new account" : "User Detail"}
          </ModalHeader>
          <ModalBody px="45px" pb={6}>
            <FormControl>
              <FormLabel>Full name</FormLabel>
              <Input
                type="text"
                placeholder="Input Full Name"
                isDisabled={!!selectedData}
                {...register("full_name")}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Input Email"
                isDisabled={!!selectedData}
                {...register("email")}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                placeholder="Input Phone Number"
                isDisabled={!!selectedData}
                {...register("phone_number")}
              />
            </FormControl>

            {!selectedData && (
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Input Password"
                  {...register("password")}
                />
              </FormControl>
            )}
          </ModalBody>

          {!selectedData && (
            <ModalFooter
              boxShadow="4px -10px 24px 2px rgba(0, 0, 0, 0.06)"
              padding="32px"
            >
              <Button
                bg="#193742"
                color="white"
                h="35px"
                w="134px"
                mr={3}
                onClick={handleOnCloseModal}
              >
                Cancel
              </Button>
              <Button
                bg="#00ADF0"
                color="white"
                h="35px"
                w="134px"
                mr={3}
                type="submit"
              >
                Create
              </Button>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  );
}
