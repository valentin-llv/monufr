import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

import Utils from "@/static/utils";

export const useUserDataStore = defineStore('userdata', () => {
    // Retrive the user data from local store
    let data = JSON.parse(localStorage.getItem('user-data') || '{}');

    // Visits infos
    const knownUser: Ref<boolean> = ref(data.knownUser || false);
    const installOnIosSeen: Ref<boolean> = ref(data.installOnIosSeen || false);

    // Theme
    const themeColor: Ref<"dark" | "light" | ""> = ref(data.themeColor || "");
    const accentColor: Ref<string> = ref(data.accentColor || "#49b583");

    const city: Ref<Cities> = ref(data.city || '');
    const planningUrls: Ref<Array<PlanningInfos>> = ref(data.planningUrls || []);

    // Use to hide events
    const hideUniqueEvent: Ref<Array<string>> = ref(data.hideUniqueEvent || []);
    const hideAllEvents: Ref<Array<string>> = ref(data.hideAllEvents || []);

    // Class prepared
    const classPrepared: Ref<Array<string>> = ref(data.classPrepared || []);

    // Events note
    const eventsNotes: Ref<NotesList> = ref(data.eventsNotes || {});

    // Events colors
    const eventsColors: Ref<EventsColorsList> = ref(data.eventsColors || {});

    // Library
    const libraryElements: Ref<LibraryStorage> = ref(data.libraryElements || {
        notes: [],
        links: [],
        mails: [],
    });

    const currentLibraryPage = ref(0);
    const selectedElement: Ref<LibraryElement | undefined> = ref();

    // Features enabled
    const featuresEnabled: Ref<Features> = ref(data.featuresEnabled || {
        prepareClass: true,
        specialColorThemes: {
            easteregg1: false,
            easteregg2: false,
            easteregg3: true,
        },
    });

    function init() {
        useUserDataStore().$subscribe((mutation, state) => {
            localStorage.setItem('user-data', JSON.stringify(state));
        });

        // Update the theme based on saved data
        if(themeColor.value != "") Utils.updateThemeColor(themeColor.value);
        if(accentColor.value != "#49b583") Utils.updateAccentColor(accentColor.value);

        // Patch the already in prod variable type
        if(Array.isArray(libraryElements.value)) libraryElements.value = {
            notes: [],
            links: [],
            mails: [],
        }

        // Patch to add special color theme to already created object
        if(!featuresEnabled.value.specialColorThemes) {
            featuresEnabled.value.specialColorThemes = {
                easterEgg1: false,
                easterEgg2: false,
                easterEgg3: true,
            }
        }
        
        if(!featuresEnabled.value.specialColorThemes.easterEgg2) featuresEnabled.value.specialColorThemes.easterEgg2 = false;
        if(!featuresEnabled.value.specialColorThemes.easterEgg3) featuresEnabled.value.specialColorThemes.easterEgg3 = true;
    }

    return {
        knownUser,
        installOnIosSeen,

        themeColor,
        accentColor,

        city,
        planningUrls,

        hideUniqueEvent,
        hideAllEvents,

        eventsNotes,
        eventsColors,

        classPrepared,

        libraryElements,
        selectedElement,
        currentLibraryPage,

        featuresEnabled,

        init,
    }
});

export interface PlanningInfos {
    date: Date,
    url: string;
}

export interface NotesList {
    [key: string]: EventNote,
}

export interface EventNote {
    date: number,
    content: string,
}

export interface EventsColorsList {
    [key: string]: EventColor,
}

export interface EventColor {
    color1: string,
}

export const cities = [
    'Tours, Université',
    'Tours, Polytech',
    'Paris, Polytech Sorbonne',
    'Paris, Sorbonne UPMC',
    'Paris, Gobelins',
    'Montpellier, Polytech',
    'Montpellier, Université',
    'Autre',
] as const;
export type Cities = typeof cities[number];

export const libObjectTypes = [
    "note",
    "link",
    "mail",
] as const;
export type LibObjectTypes = typeof libObjectTypes[number];

interface LibraryStorage {
    notes: Array<LibraryElement>,
    mails: Array<LibraryElement>,
    links: Array<LibraryElement>,
}

export interface LibraryElement {
    type: string,
    title: string,
    content: string,
    date: Date,
}

export interface Features {
    prepareClass: boolean,
    specialColorThemes: SpecialColorsRewards,
}

export interface SpecialColorsRewards {
    easterEgg1: boolean,
    easterEgg2: boolean,
    easterEgg3: boolean,
}