import { Post } from "@/app/types/dataTypes";
import { atom } from "jotai";

export const postsAtom = atom<Post[]>([])

export const postsPageAtom = atom(1)