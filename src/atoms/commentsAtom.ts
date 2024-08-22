import { Comment } from '@/app/types/dataTypes';
import { atom } from 'jotai';

export const commentsAtom = atom<Comment[]>([]);