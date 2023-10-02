"use client";

import styles from "./home.module.scss";
import React, { use, useCallback, useEffect, useState } from "react";
import { useNewsStore, newsResultType } from "../store/news";
import { NewsWebsites } from "../constant";
import { Link, MagnifyingGlass } from "@phosphor-icons/react";
import { IconButton } from "./button";
import { api } from "../api/client";

export const EditorPart = (props: {
  topic: string;
  setTopic: (topic: string) => void;
  setBody: (body: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}) => {
  const { topic, setTopic, setBody, setIsLoading } = props;
  const newsStore = useNewsStore();

  const searchTopic = useCallback(
    (topic: string) => {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-key": "1ffe6751-a61d-4d48-8222-2240c183f774",
        },
        body: JSON.stringify({
          query: topic,
          numResults: 3,
          includeDomains: NewsWebsites,
          useAutoprompt: true,
          startPublishedDate: "2023-10-01T00:00:00-08:00",
        }),
      };

      fetch("https://api.metaphor.systems/search", options)
        .then((response) => response.json())
        .then((response) => {
          const newsResults: newsResultType[] = response.results.map(
            (news: newsResultType) => {
              const options = {
                method: "GET",
                headers: {
                  accept: "application/json",
                  "x-api-key": "1ffe6751-a61d-4d48-8222-2240c183f774",
                },
              };

              fetch(
                `https://api.metaphor.systems/contents?ids=${news.id}`,
                options,
              )
                .then((response) => response.json())
                .then((response) =>
                  newsStore.updateExtract(
                    news.id,
                    response.contents[0].extract,
                  ),
                )
                .catch((err) => console.error(err));

              return {
                title: news.title,
                url: news.url,
                publishedDate: news.publishedDate,
                author: news.author,
                id: news.id,
                score: news.score,
                extract: "",
              };
            },
          );
          newsStore.updateSearchResults(newsResults);
        })
        .catch((err) => console.error(err));
    },
    [newsStore],
  );

  const generateBody = async () => {
    setIsLoading(true);

    const prompt = `Assume you are an author named Hewsletter, try to sumarize the news below and write a newsletter in markdown format to user: \n\n`;

    const body = newsStore.searchResults.map((value) => {
      return `# ${value.title}\n\n${value.extract}\n\n`;
    });

    const reply = { message: "" };
    newsStore.updateBody(reply.message);

    api.llm.chat({
      messages: `${prompt}${body.join("\n")}`,
      onUpdate(message) {
        setIsLoading(true);
        console.log("[Chat] update ", message.length);
        if (message) {
          reply.message = message;
        }
        newsStore.updateBody(message);
      },
      onFinish(message) {
        setIsLoading(false);
        if (message) {
          reply.message = message;
        }
      },
      onError(error: any) {
        console.error("[Chat] failed ", error);
        const newBody = "### Something went wrong, please try again later";
        newsStore.updateBody(newBody);
      },
    });
    setIsLoading(false);
  };

  // const fetchNewsContent = useCallback(
  //   (id: string) => {
  //     const options = {
  //       method: "GET",
  //       headers: {
  //         accept: "application/json",
  //         "x-api-key": "1ffe6751-a61d-4d48-8222-2240c183f774",
  //       },
  //     };

  //     fetch(`https://api.metaphor.systems/contents?ids=${id}`, options)
  //       .then((response) => response.json())
  //       .then((response) => {
  //         // print the first 10 cahracters of the extract
  //         console.log(response.contents[0].extract.substring(0, 10));
  //         newsStore.updateExtract(id, response.contents[0].extract);
  //       })
  //       .catch((err) => console.error(err));
  //   },
  //   [newsStore],
  // );

  // const handleFetch = useCallback(() => {
  //   newsStore.searchResults.forEach((value) => {
  //     fetchNewsContent(value.id);
  //   });
  // }, [fetchNewsContent, newsStore.searchResults]);

  const color = "#ffcc33";

  return (
    <div className={styles["editor"]}>
      <h2>Hewsletter</h2>
      <div style={{ display: "flex", flexDirection: "row-reverse" }}>
        -- your customized newsletter
      </div>
      <h3>Choose the topic you are interested: </h3>
      <div className={styles["editor-input"]}>
        <input
          className={styles["input-value"]}
          onChange={(e) => {
            setTopic(e.target.value);
          }}
          placeholder={topic}
          required
          type="text"
          id="to"
          style={{ borderColor: color }}
        />
      </div>

      <div
        className={styles["editor-search-btn"]}
        style={{ color: "red", fontWeight: "bold" }}
      >
        <IconButton
          icon={<MagnifyingGlass size={32} weight="bold" color={"red"} />}
          text="Search"
          onClick={() => searchTopic(topic)}
        />
        <IconButton
          icon={<MagnifyingGlass size={32} weight="bold" color={"red"} />}
          text="Generate NewsLetter"
          onClick={generateBody}
        />
      </div>

      <div>
        {newsStore.searchResults.length > 0 &&
          newsStore.searchResults.map((value) => {
            return (
              <div key={value.id} className={styles["news-item"]}>
                <div className={styles["item-name"]}>
                  <div>{value.title}</div>
                  <a href={value.url}>
                    <Link size={24} weight="bold" color="#2775b6" />
                  </a>
                </div>
                <div className={styles["item-info"]}>
                  <div className={styles["item-time"]}>
                    {value.publishedDate}
                  </div>
                  <div>{value.author || ""}</div>
                </div>
                <div className={styles["item-extract"]}>
                  {value.extract.substring(0, 100) + "..."}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
