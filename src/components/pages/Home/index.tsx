"use client";
import { Fragment } from "react";

import {
  Box,
  Card,
  Flex,
  GridItem,
  Heading,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

import Button from "@/components/elements/Button";
import Grid from "@/components/elements/Grid";

import JoinWithUsVignette from "./_assets/join_us_vignette.png";

import {
  FOOTER_CARD,
  MIDDLE_CARDS,
  MIDDLE_EMPHASIZE,
  MIDDLE_TITLE,
  RIGHT_MAIN_CARD,
  RIGHT_MAIN_CARD_EMPHASIZE,
} from "./_constants/copywritings";

import Carousel from "./_components/Carousel";

import styles from "./index.module.css";
import MainLayout from "@/components/layouts/MainLayout";

import Link from "next/link";
import { constructWAChat } from "@/utils/helper";
import { phone_number } from "./index.constants";

export default function HomeComponent() {
  const renderWordWithEmphasize = (words: string, emphasize: string[]) => {
    const splittedWords = words.split(" ");
    return splittedWords.map((word, index) => (
      <Fragment key={index}>
        {emphasize.includes(word) ? (
          <span className={styles.rightMainCardEmphasized}>{word}</span>
        ) : (
          word
        )}
        {index === splittedWords.length - 1 ? "" : " "}
      </Fragment>
    ));
  };

  const createSupportLink = () => {
    return constructWAChat({
      head: "Halo+Ka%2C+saya+ingin+mendaftar+sebagai+responden+survey.in",
      body: `username+%3A+%0D%0Aemail+%3A+`,
      phone_number,
    });
  };

  return (
    <MainLayout>
      <Grid gap={12} paddingBottom={20}>
        <GridItem colSpan={12}>
          <Carousel />
        </GridItem>
        <GridItem gridColumn="1 / -1">
          <Flex gap="11.4vh">
            <Box
              w="100%"
              // maxW={640}
              h="44vh"
              maxH={415}
              borderRadius={80}
              bg="main.grey1"
            >
              <video
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "inherit",
                  top: 0,
                  left: 0,
                }}
                controls
                autoPlay
              >
                <source src="/static/videos/Tutorial Surveyin.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
            <Card
              w="100%"
              maxW={560}
              h="44vh"
              maxH={415}
              borderRadius={80}
              boxShadow="4px 10px 24px 2px rgba(0, 0, 0, 0.10)"
              p={14}
            >
              <Heading as="h2" size="xl" fontWeight="600">
                {renderWordWithEmphasize(
                  RIGHT_MAIN_CARD.title,
                  RIGHT_MAIN_CARD_EMPHASIZE
                )}
                .
              </Heading>
              <br />
              <OrderedList>
                {RIGHT_MAIN_CARD.list.map((text, index) => (
                  <ListItem key={index}>{text}</ListItem>
                ))}
              </OrderedList>
            </Card>
          </Flex>
        </GridItem>
        <GridItem gridColumn="1 / 8">
          <Heading as="h2" size="3xl" fontWeight="normal">
            {renderWordWithEmphasize(MIDDLE_TITLE, MIDDLE_EMPHASIZE)}
          </Heading>
        </GridItem>
        <GridItem gridColumn="1 / -1">
          <Flex gap="3.3vh">
            {MIDDLE_CARDS.map(({ icon, title, description }, index) => (
              <Card
                w="100%"
                // maxW={364.92}
                // h="27vh"
                // maxH={204}
                p="3.3vh"
                key={index}
                borderRadius={40}
                boxShadow="4px 10px 24px 2px rgba(0, 0, 0, 0.10)"
                textAlign="center"
                boxSizing="content-box"
              >
                <Image
                  className={styles.centerAligned}
                  alt="title"
                  src={icon}
                  width={55}
                  height={55}
                />
                <Heading
                  as="h4"
                  fontSize={28}
                  marginTop="3.3vh"
                  marginBottom="1.6vh"
                  fontWeight="600"
                >
                  {index + 1}. {title}
                </Heading>
                <Text>{description}</Text>
              </Card>
            ))}
          </Flex>
        </GridItem>
        <GridItem gridColumn="1 / -1" p="0 4.4vw">
          <Card border="none" boxShadow="none">
            <Grid>
              <GridItem
                bg="#1287DB"
                color="white"
                colSpan={6}
                pl="10.1vh"
                pt="6.7vh"
                borderTopLeftRadius="80px"
                borderBottomLeftRadius="80px"
              >
                <Heading as="h4" size="xl" fontWeight="600">
                  {FOOTER_CARD.title}
                </Heading>
                <Heading as="h2" size="2xl" fontWeight="600">
                  {FOOTER_CARD.description}
                </Heading>
                <br />
                <OrderedList gap="1.6vh">
                  {FOOTER_CARD.list.map((text, index) => (
                    <ListItem key={index}>{text}</ListItem>
                  ))}
                </OrderedList>
                <br />
                <Link
                  href={createSupportLink()}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button bg="#C7E8F5" color="#193742" p="1.6vh">
                    Sign Up
                  </Button>
                </Link>
              </GridItem>
              <GridItem colSpan={6}>
                <Image
                  className={styles.vignetteImg}
                  alt="Join with us"
                  src={JoinWithUsVignette}
                />
              </GridItem>
            </Grid>
          </Card>
        </GridItem>
      </Grid>
    </MainLayout>
  );
}
