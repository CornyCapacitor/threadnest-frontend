import { Post } from "@/app/types/postType";
import { atom } from "jotai";

export const postsAtom = atom<Post[] | null>(null)