import { atomWithStorage } from 'jotai/utils';

type User = {
  token: string | null;
  email: string | null;
  username: string | null;
};

export const userAtom = atomWithStorage<User | null>('threadNestUserAtom', null);