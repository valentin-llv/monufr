export default class DateManager {
    static getDateText(date: Date): string {
        let day = date.getDate();
        let monthName = this.getMonthsName()[date.getMonth()];
        let year = date.getFullYear();

        return day + " " + monthName + " " + year;
    }

    static getHourText(date: Date): string {
        let minutes: any = date.getMinutes();
        let hours = date.getHours();

        if(minutes <= 10) minutes = "0" + minutes;

        return hours + "h" + minutes
    }

    static getDayNumber(date: Date): number {
        let currentDayNumber = date.getDay();

        if(currentDayNumber == 0) currentDayNumber = 6;
        else currentDayNumber -= 1;

        return currentDayNumber;
    }

    static getDaysName(): Array<string> {
        return ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];;
    }

    static getMonthsName(): Array<string> {
        return ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    }
}