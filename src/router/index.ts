import Vue from 'vue'
import VueRouter, {Route} from 'vue-router'
import Index from '@/views/Index.vue'
import Home from '@/views/Home.vue'
import StyleGuide from '@/views/StyleGuide.vue'
import ProgramManagement from '@/views/ProgramManagement.vue'
import AdminProgramManagement from '@/views/AdminProgramManagement.vue'
import AdminUserManagement from '@/views/AdminUserManagement.vue'
import store from '@/store/index.ts';
import {LOGIN, LOGOUT, REQUESTED_PATH, ERROR_STATE, SET_ACTIVE_PROGRAM} from '@/store/mutation-types';
import ProgramLocationsManagement from "@/views/ProgramLocationsManagement.vue";
import ProgramUserManagement from "@/views/ProgramUsersManagement.vue";
import ProgramSelection from "@/views/ProgramSelection.vue";
import {UserService} from "@/breeding-insight/service/UserService";
import {User} from "@/breeding-insight/model/User";
import {isProgramsPath, processProgramNavigation} from "@/router/guards";
import {ProgramService} from "@/breeding-insight/service/ProgramService";
import {Program} from "@/breeding-insight/model/Program";

Vue.use(VueRouter);

const layouts = {
  adminSideBar: 'adminSideBar',
  userSideBar: 'userSideBar',
  simple: 'simple',
  noSideBar: 'noSideBar'
}

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Welcome',
      layout: layouts.simple
    },
    component: Index
  },
  {
    path: '/style-guide',
    name: 'style-guide',
    meta: {
      title: 'Style Guide',
      layout: layouts.simple
    },
    component: StyleGuide
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: 'About',
      layout: layouts.userSideBar
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  { path: '/admin',
    name: 'admin',
    redirect: '/admin/program-management' },
  {
    path: '/admin/program-management',
    name: 'admin-program-management',
    meta: {
      title: 'Admin Program Management',
      layout: layouts.userSideBar
    },
    component: AdminProgramManagement
  },
  {
    path: '/admin/user-management',
    name: 'admin-user-management',
    meta: {
      title: 'Admin User Management',
      layout: layouts.userSideBar
    }, 
    component: AdminUserManagement
  },
  {
    path: '/programs/:programId',
    name: 'program',
    redirect: (to: Route) => ({name: 'program-home', params: {programId: to.params.programId}}),
  },
  {
    path: '/programs/:programId/home',
    name: 'program-home',
    meta: {
      title: 'Welcome',
      layout: layouts.userSideBar
    },
    component: Home,
    beforeEnter: processProgramNavigation,
  },
  {
    path: '/programs/:programId/program-management',
    name: 'program-management',
    meta: {
      title: 'Program Management',
      layout: layouts.userSideBar
    },
    component: ProgramManagement,
    redirect: {name: 'program-locations'},
    beforeEnter: processProgramNavigation,
    children: [
      {
        path: 'locations',
        name: 'program-locations',
        meta: {
          title: 'Program Location Management',
          layout: layouts.userSideBar
        },
        component: ProgramLocationsManagement
      },
      {
        path: 'users',
        name: 'program-users',
        meta: {
          title: 'Program User Management',
          layout: layouts.userSideBar
        },
        component: ProgramUserManagement
      }
    ]
  },
  {
    path: '/program-selection',
    name: 'program-selection',
    meta: {
      title: 'Select A Program',
      layout: layouts.noSideBar
    },
    component: ProgramSelection
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: Route, from: Route, next: Function) => {

  // TODO: Check if the page is a protected resource, if not, let them through
  // If page is protected, check if they are logged in. 
  // TODO: Check if their token has expired.

  // Clear path dependent store data for easier state management
  if (!isProgramsPath(to)){
    store.commit(SET_ACTIVE_PROGRAM, undefined);
  }

  if (!store.state.loggedIn) {

    //Get the user info
    UserService.getUserInfo()
    .then((user: User) => {
      store.commit(LOGIN, user);
      if (to.name !== 'home') { next(); }
      else { next({name: 'program-selection'})}
    })
    .catch((error) => {
      // Check if it is a 401
      if (error.response && error.response.status === 401) {
          Vue.$log.info(`Unauthorized login, ${error.response}`);
          store.commit(ERROR_STATE, {'loginFailed': true});
      } else {
        store.commit(ERROR_STATE, {'loginFailed': false, 'loginServerError':true});
      }
      // If logged in fail, send them to the home page
      if (to.name !== 'home') {
        //TODO: Show error to login again.
        next({name: 'home'});
      } else next();
    });
  } else {
    next();
  }
  // Set page title
  document.title = to.meta.title + ' | Breeding Insight Platform' || 'Breeding Insight Platform'
});




export default router
