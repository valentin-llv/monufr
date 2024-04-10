import { createRouter, createWebHashHistory } from "vue-router";

import { useUserDataStore } from "@/stores/userdata";
import { usePlanningStore } from "@/stores/planning";

import FirstTime from "@/views/FirstTime/FirstTime.vue";

import Base from "@/views/Base.vue";

import Home from "@/views/Home/Home.vue";
import Planning from "@/views/Planning/Planning.vue";

import AddPlanning from "@/views/AddPlanning/AddPlanning.vue";
import ScanCode from "@/views/AddPlanning/ScanCode.vue";
import UseUrl from "@/views/AddPlanning/UseUrl.vue";
import HowTo from "@/views/AddPlanning/HowTo.vue";

import Help from "@/views/Help/Help.vue";
import InstallOnIos from "@/views/Help/InstallOnIos/InstallOnIos.vue";
import BugReport from "@/views/Help/BugReport/BugReport.vue";

import EventPage from "@/views/EventPage/EventPage.vue";
import HideEvents from "@/views/EventPage/HideEvents.vue";
import EditNote from "@/views/EventPage/EditNote.vue";

import Settings from "@/views/Settings/Settings.vue";

import ShareApp from "@/views/Settings/Share/ShareApp.vue";
import SharePlanning from "@/views/Settings/Share/SharePlanning.vue";

import Appearance from "@/views/Settings/Application/Appearance.vue";
import UnlockNewTheme from "@/views/Settings/Application/UnlockNewTheme.vue";

import PrepareClass from "@/views/Settings/Features/PrepareClass.vue";
import PlanningFeature from "@/views/Settings/Features/Planning/Planning.vue";
import RestoreEvents from "@/views/Settings/Features/Planning/RestoreEvents.vue";
import RestoreTypeEvent from "@/views/Settings/Features/Planning/RestoreTypeEvent.vue";
import DeletePlanning from "@/views/Settings/Features/Planning/DeletePlanning.vue";

import MiniGame from "@/views/EasterEgg/MiniGame/MiniGame.vue";

import Library from "@/views/Library/Library.vue";
import AddItem from "@/views/Library/Items/AddItem.vue";
import EditItem from "@/views/Library/Items/EditItem.vue";

let firstLoad = true;

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        // Prevent 404 route
        { 
            path: '/:pathMatch(.*)*',
            component: Base,
            beforeEnter: () => {
                return '/';
            },
        },

        // Intro
        {
            path: "/intro",
            component: FirstTime,
            name: "first-time",
            meta: {
                depth: 0,
                transitionName: "slide"
            },
            beforeEnter: () => {
                if(useUserDataStore().knownUser == true) return '/';
            },
        },

        // Home
        {
            path: "/",
            component: Base,
            children: [
                {
                    path: "",
                    component: Home,
                    name: "home",
                    meta: {
                        depth: 0,
                        transitionName: "fade"
                    }
                },

                {
                    path: "planning",
                    component: Planning,
                    name: "planning",
                    meta: {
                        depth: 0,
                        transitionName: "fade"
                    }
                },

                {
                    path: "library",
                    component: Library,
                    name: "library",
                    meta: {
                        depth: 0,
                        transitionName: "fade"
                    }
                },
            ],
            meta: {
                depth: 0,
                transitionName: "fade"
            }
        },

        // Events
        {
            path: "/event",
            component: EventPage,
            name: "event-page",
            meta: {
                depth: 1,
                transitionName: "slide"
            },
            beforeEnter: () => {
                if(usePlanningStore().selectedEvent == undefined) return '/planning';
            },
        },

        {
            path: "/event/hide-event",
            component: HideEvents,
            name: "hide-event",
            meta: {
                depth: 2,
                transitionName: "slide"
            },
            beforeEnter: () => {
                if(usePlanningStore().selectedEvent == undefined) return '/planning';
            },
        },

        {
            path: "/event/edit-note",
            component: EditNote,
            name: "edit-note",
            meta: {
                depth: 2,
                transitionName: "slide"
            },
            beforeEnter: () => {
                if(usePlanningStore().selectedEvent == undefined) return '/planning';
            },
        },

        // Add planning
        {
            path: "/new-planning",
            component: AddPlanning,
            name: "add-planning",
            meta: {
                depth: 3,
                transitionName: "slide"
            }
        },

        {
            path: "/new-planning/scan",
            component: ScanCode,
            name: "scan",
            meta: {
                depth: 4,
                transitionName: "slide"
            }
        },

        {
            path: "/new-planning/use-url",
            component: UseUrl,
            name: "use-url",
            meta: {
                depth: 4,
                transitionName: "slide"
            }
        },

        {
            path: "/new-planning/how-to",
            component: HowTo,
            name: "how-to",
            meta: {
                depth: 5,
                transitionName: "slide"
            }
        },

        // Library
        {
            path: "/library/add-item",
            component: AddItem,
            name: "add-item",
            meta: {
                depth: 2,
                transitionName: "slide"
            },
        },

        {
            path: "/library/edit-item",
            component: EditItem,
            name: "edit-item",
            meta: {
                depth: 2,
                transitionName: "slide"
            },
            beforeEnter: () => {
                if(useUserDataStore().selectedElement == undefined) return '/library';
            },
        },

        // Settings
        {
            path: "/settings",
            component: Settings,
            name: "settings",
            meta: {
                depth: 1,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/share/app",
            component: ShareApp,
            name: "share-app",
            meta: {
                depth: 2,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/share/planning",
            component: SharePlanning,
            name: "share-planning",
            meta: {
                depth: 2,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/appearance",
            component: Appearance,
            name: "appearance",
            meta: {
                depth: 2,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/unlock-new-theme",
            component: UnlockNewTheme,
            name: "unlock-new-theme",
            meta: {
                depth: 3,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/planning-feature",
            component: PlanningFeature,
            name: "planning-feature",
            meta: {
                depth: 2,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/planning-feature/restore-events",
            component: RestoreEvents,
            name: "restore-events",
            meta: {
                depth: 3,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/planning-feature/restore-type-event",
            component: RestoreTypeEvent,
            name: "restore-type-event",
            meta: {
                depth: 3,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/planning-feature/delete-planning",
            component: DeletePlanning,
            name: "delete-planning",
            meta: {
                depth: 3,
                transitionName: "slide"
            }
        },

        {
            path: "/settings/prepare-class-feature",
            component: PrepareClass,
            name: "prepare-class",
            meta: {
                depth: 2,
                transitionName: "slide"
            }
        },

        // Help
        {
            path: "/help",
            component: Help,
            name: "help",
            meta: {
                depth: 2,
                transitionName: "slide"
            }
        },

        {
            path: "/help/install-on-ios",
            component: InstallOnIos,
            name: "install-on-ios",
            meta: {
                depth: 3,
                transitionName: "slide"
            }
        },

        {
            path: "/help/bug-report",
            component: BugReport,
            name: "bug-report",
            meta: {
                depth: 3,
                transitionName: "slide"
            }
        },

        // Mini game
        {
            path: "/easter-egg-mini-game",
            component: MiniGame,
            name: "mini-game",
            meta: {
                depth: 2,
                transitionName: "slide"
            }
        },
    ],
});

router.beforeEach(async (to, from) => {
    if(firstLoad && (!window.location.hostname.includes("localhost") && !window.location.hostname.includes('192.168'))) {
        firstLoad = false;
        router.replace({ path: '/' });
    }

    if(useUserDataStore().knownUser == false && to.fullPath != "/intro") {
        router.replace({ path: '/intro' });
    }
});

router.afterEach((to, from) => {
    if(to.meta.transitionName == "fade") to.meta.useTransition = "fade";
    
    if(to.meta.depth == from.meta.depth) to.meta.useTransition = "fade";
    if(to.meta.depth > from.meta.depth) to.meta.useTransition = "slide-in";
    if(to.meta.depth < from.meta.depth) to.meta.useTransition = "slide-out";
});

declare module 'vue-router' {
    interface RouteMeta {
        depth: number,
        transitionName: string,
        useTransition?: string,
    }
}

export default router