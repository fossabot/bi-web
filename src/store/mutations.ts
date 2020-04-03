import { MutationTree } from 'vuex';
import { User, Program, RootState } from '@/store/types';
import { ERROR_STATE, LOGIN, LOGOUT, REQUESTED_PATH, SET_ACTIVE_PROGRAM } from '@/store/mutation-types';

export const mutations: MutationTree<RootState> = {
  [LOGIN] (state, user: User) {
    state.apiError = false;
    state.apiUnavailable = false;
    state.loggedIn = true;
    state.user = user;
  },
  [LOGOUT] (state) {
    state.apiError = false;
    state.apiUnavailable = false;
    state.loggedIn = false;
    state.user = undefined;
  },
  [ERROR_STATE] (state, payload: any) {
    state.apiError = payload.apiError;
    state.apiUnavailable = payload.apiUnavailable;
    state.loginFailed = payload.loginFailed;
    state.loginServerError = payload.loginServerError;
  },
  [REQUESTED_PATH] (state, payload: any) {
    state.requestedPath = payload.path;
  },
  [SET_ACTIVE_PROGRAM] (state, program: Program) {
    state.program = program;
  }
};
