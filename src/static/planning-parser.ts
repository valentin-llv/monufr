import { usePlanningStore } from "@/stores/planning";
import { useUserDataStore } from "@/stores/userdata";

export default class PlanningParser {
    static parseRowPlanningFile(rowPlanning: string): Array<RowEvent> {
        let userDataStore = useUserDataStore();

        let events: Array<RowEvent> = [];
        let splitedText = rowPlanning.replaceAll('\r\n ', '').replaceAll('\r\n', '').replaceAll('   ', ' ').replaceAll('  ', ' ').split('BEGIN:VEVENT').slice(1);
    
        for(let i = 0; i < splitedText.length; i++) {
            let event = splitedText[i];
            let uid, description, dateStart, dateEnd, location, summary;
    
            if(userDataStore.city == "Paris, Gobelins") { // Gobelins template
                uid = event.split('UID:')[1].split('DTSTAMP:')[0];
                description = event.split('DESCRIPTION:')[1].split('DTSTART:')[0];
                dateStart = event.split('DTSTART:')[1].split('DTEND:')[0];
                dateEnd = event.split('DTEND:')[1].split('LOCATION:')[0];
                location = event.split('LOCATION:')[1].split('SUMMARY:')[0];
                summary = event.split('SUMMARY:')[1].split('END:')[0];
            } else  { // Polytech template
                dateStart = event.split('DTSTART:')[1].split('DTEND:')[0];
                dateEnd = event.split('DTEND:')[1].split('SUMMARY:')[0];
                summary = event.split('SUMMARY:')[1].split('LOCATION:')[0];
                location = event.split('LOCATION:')[1].split('DESCRIPTION:')[0];
                description = event.split('DESCRIPTION:')[1].split('UID:')[0];
                uid = event.split('UID:')[1].split('CREATED:')[0];
            }
    
            events.push({
                start: dateStart,
                end: dateEnd,

                summary: summary,
                location: location,
                description: description,

                uid: uid,
            });
        }

        return events;
    }

    static parseEvents(rowEvents: Array<RowEvent>): Array<PlanningEvent> {
        let userDataStore = useUserDataStore();
        let parsedEvents: Array<PlanningEvent> = [];

        for(let i = 0; i < rowEvents.length; i++) {
            let event = rowEvents[i];

            let summary = event.summary;
            if(userDataStore.city.includes('Sorbonne')) summary = event.summary[0].toUpperCase() + event.summary.replaceAll('_', ' ').slice(1);
            else if(userDataStore.city.includes('Montpellier')) summary = event.summary.replaceAll('-', ' - ');
            else if(userDataStore.city.includes('Gobelins')) summary = event.summary.split(' - ')[0];

            let descriptionSplited = event.description.replaceAll('\\n ', '').split('\\n');

            /* Find the part, in the description, that correspond to the teacher's name */
            let teacher = "???";
            if(userDataStore.city.includes('Gobelins')) {
                let summarySplited = event.summary.split(' - ');
                if(summarySplited.length >= 2 && summarySplited[1][0] == 'M') teacher = summarySplited[1];
                else teacher = "En autonomie";
            } else {
                for(let j = 0; j < descriptionSplited.length - 3; j++) {
                    let candidate = descriptionSplited[descriptionSplited.length - 3 - j];
    
                    // Parsing method depends on the city wich exported the planning
                    let candidateAccepted = false;
                    if(userDataStore.city.includes('Tours')) {
                        if(candidate != '' && candidate.toUpperCase() == candidate && (candidate.split(' ').length == 2 || candidate.split(' ').length == 3)) {
                            candidateAccepted = true;
                        } else break;
                    } else if(userDataStore.city.includes('Sorbonne')) {
                        let candidateSplited = candidate.split(' ');
    
                        if(candidate != '' && candidateSplited.length == 2) {
                            let candidateName = candidateSplited[1].split('-')[0].slice(1);
    
                            if(candidateName.toLowerCase() == candidateName && candidateName.match(/\d+/g) == null) {
                                candidateAccepted = true;
                            }
                        } else break;
                    } else if (userDataStore.city.includes('Montpellier')) {
                        if(candidate == 'A valider') {
                            // Do nothing
                        } else if(candidate.toUpperCase() == candidate && candidate.split(' ').length == 2) {
                            candidateAccepted = true;
                        } else break;
                    }
    
                    if(candidateAccepted) {
                        if(teacher == '???') teacher = '';
                        else if(teacher != '') teacher += ', ';

                        teacher += candidate;
                    }
                }
            }

            /* Keep the relevant part of the description */
            let description = '';
            // for(let j = 0; j < descriptionSplited.length; j++) {
            //     if(j <= 1 || j >= descriptionSplited.length - 2 || (teacher != '???' && j >= descriptionSplited.length - 2 - teacher.split(',').length)) {}
            //     else {
            //         if(description != '') description += ', ';

            //         if(userDataStore.city.includes('Sorbonne')) {
            //             description = description + descriptionSplited[j].replaceAll('_', ' ');
            //         } else description = description + descriptionSplited[j];
            //     }
            // }

            let location = event.location;
            if(location == "") location = "???";
            else {
                if(userDataStore.city.includes('Sorbonne')) location = event.location.replaceAll('*', '').replaceAll('\\,', ', ');
                else if(userDataStore.city.includes('Montpellier')) location = event.location.replaceAll('\\', '').replaceAll(',', ', ');
            }

            let startDateString = event.start.slice(0, 4) + '-' + event.start.slice(4, 6) + '-' + event.start.slice(6, 8) + event.start.slice(8, 11) + ':' + event.start.slice(11, 13) + ':' + event.start.slice(13, 16);
            let start = new Date(startDateString);

            let endDateString = event.end.slice(0, 4) + '-' + event.end.slice(4, 6) + '-' + event.end.slice(6, 8) + event.end.slice(8, 11) + ':' + event.end.slice(11, 13) + ':' + event.end.slice(13, 16);
            let end = new Date(endDateString);

            let duration = (end.getTime() - start.getTime()) / (1000 * 60);

            let parsedEvent: PlanningEvent = {
                teacher: teacher,
                description: description,
                location: location,
                summary: summary,

                start: start,
                end: end,
                duration: duration,

                uid: event.uid,
            };

            parsedEvents.push(parsedEvent);
        }

        return parsedEvents;
    }

    static orderEvents(events: Array<PlanningEvent>): SortedPlanning {
        let userDataStore = useUserDataStore();

        let todayMorning = new Date();
        todayMorning.setHours(0);

        // Filter events
        let filteredEvents: Array<PlanningEvent> = [];
        let eventToHide: Array<PlanningEvent> = [];
        for(let i = 0; i < events.length; i++) {
            if(userDataStore.hideUniqueEvent.includes(events[i].uid)) eventToHide.push(events[i]); // Save hidden elements in separate array
            else if(userDataStore.hideAllEvents.includes(events[i].summary)) continue; // Hide all same events
            else filteredEvents.push(events[i]);
        }

        let orderedEvents: Array<PlanningEvent> = [];
        let uidTreated: Array<string> = [];
        for(let i = 0; i < filteredEvents.length; i++) {
            if(uidTreated.includes(filteredEvents[i].uid)) continue;
            else if(orderedEvents.length == 0) orderedEvents.push(filteredEvents[i]);
            else {
                for(let j = 0; j < orderedEvents.length; j++) {
                    if(filteredEvents[i].start.getTime() < orderedEvents[j].start.getTime()) {
                        orderedEvents.splice(j, 0, filteredEvents[i]);
                        break;
                    } else if(j == orderedEvents.length - 1) {
                        orderedEvents.push(filteredEvents[i]);
                        break;
                    }
                }

                uidTreated.push(events[i].uid);
            }
        }

        let planning: Array<Array<PlanningEvent>> = [];
        for(let i = 0; i < orderedEvents.length; i++) {
            if(i == 0) planning.push([orderedEvents[i]]);
            else {
                if(planning[planning.length - 1][0].start.getDate() == orderedEvents[i].start.getDate()) planning[planning.length - 1].push(orderedEvents[i]);
                else planning.push([orderedEvents[i]]);
            }
        }

        return {
            planning: planning,
            eventsToHide: eventToHide,
        };
    }
}

export interface RowEvent {
    start: string,
    end: string,

    summary: string,
    location: string,
    description: string,

    uid: string,
}

export interface PlanningEvent {
    start: Date,
    end: Date,
    duration: number,

    summary: string,
    location: string,
    teacher: string,
    description: string,

    uid: string,
}

export interface SortedPlanning {
    planning: Array<Array<PlanningEvent>>,
    eventsToHide: Array<PlanningEvent>,
}