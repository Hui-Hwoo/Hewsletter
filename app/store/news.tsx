import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { NewsWebsites, NewsTopics } from "../constant";

export interface newsResultType {
  title: string;
  url: string;
  publishedDate: string;
  author: string;
  id: string;
  score: number;
  extract: string;
}

interface NewsState {
  topic: string;
  topicOptions: string[];
  searchResults: newsResultType[];
  body: string;
  changeTopic: (topic: string) => void;
  updateSearchResults: (results: newsResultType[]) => void;
  updateExtract: (id: string, extract: string) => void;
  updateBody: (body: string) => void;
}

export const useNewsStore = create<NewsState>()(
  devtools(
    persist(
      (set, get) => ({
        topic: "interest rate",
        topicOptions: NewsTopics,
        searchResults: [],
        body: "",
        changeTopic: (topic) => {
          set({ topic });
        },
        updateExtract: (id, extract) => {
          // the news with the id is updated and update its extract
          const oldResults = get().searchResults;
          const newResults = oldResults.map((value) => {
            if (value.id === id) {
              return { ...value, extract: extract } as newsResultType;
            } else {
              return value;
            }
          });
          set({ searchResults: newResults });
        },
        updateSearchResults: (results) => {
          set({ searchResults: results });
        },
        updateBody: (body: string) => {
          set((state) => ({ ...state, body }));
        },
      }),

      { name: "newsStore" },
    ),
    {
      name: "newsStore",
    },
  ),
);
