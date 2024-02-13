// app/providers.tsx
"use client";

import { useEffect, useState } from "react";
import { Work_Sans } from "next/font/google";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PropsWithRequiredChildren } from "@/types";

import theme from "@/theme";
import reverse_logo from "@/assets/reverse-logo.svg";
import Image from "next/image";

import { useAuthStore } from "@/stores/auth";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getUserDetail } from "@/services/user";
import { useRouter } from "next/navigation";

const workSans = Work_Sans({ subsets: ["latin"] });

import Cookies from "js-cookie";

export default function Providers({
  children,
}: PropsWithRequiredChildren<unknown>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  });

  const { replace } = useRouter();
  const { setCurrentUser, currentUser } = useAuthStore();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const hasLogin = Cookies.get("signed-id");
    if (hasLogin) {
      setRedirecting(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDetail = await getUserDetail(user.uid);
            if (!!userDetail) {
              const signedId = user.uid;
              Cookies.set("signed-id", signedId, { expires: 99 });
              setRedirecting(true);
              Cookies.set("current-user", JSON.stringify(userDetail), {
                expires: 99,
              });
              const payload = {
                ...user,
                userDetail,
              };
              await setCurrentUser(payload);
              if (payload.userDetail.role === "super-admin")
                replace("/app-control");
              if (payload.userDetail.role === "admin")
                replace("/questionnaire");
            }
          } catch (error) {
            console.log(error);
            location.reload();
          } finally {
            setRedirecting(false);
          }
        } else {
          setRedirecting(false);
          console.log(new Error("You are not log in bro"));
        }
      });

      return () => unsubscribe();
    }
  }, [replace, setCurrentUser]);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-work-sans: ${workSans.style.fontFamily};
          }
        `}
      </style>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            {redirecting ? (
              <Flex
                h="100vh"
                w="100vw"
                justifyContent="center"
                alignItems="center"
              >
                <Image width={320} src={reverse_logo} alt="logo" />
              </Flex>
            ) : (
              children
            )}
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </>
  );
}
