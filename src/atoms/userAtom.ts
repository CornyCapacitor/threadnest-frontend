import { User } from '@/app/types/dataTypes';
import { atomWithStorage } from 'jotai/utils';

export const userAtom = atomWithStorage<User | null>('threadNestUserAtom', null);