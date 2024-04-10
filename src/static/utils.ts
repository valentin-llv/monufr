import { useUserDataStore } from "@/stores/userdata";

export default class Utils {
    static cssTagForSpecialThemeColors: HTMLStyleElement | undefined;

    static isIOS(): boolean {
        return [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod'
        ].includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }

    static isValidUrl(string: string): boolean {
        let url;
        
        try { url = new URL(string);
        } catch (_) { return false; }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    static isValidEmailAddress(mail: string) {
        let pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
        return pattern.test(mail);
    }

    static updateThemeColor(themeColor?: "dark" | "light") {
        let userData = useUserDataStore();
        if(!themeColor && userData.themeColor) themeColor = userData.themeColor;

        let shade = [900, 800, 300, 200, 100];
        for(let i = 0; i < shade.length; i++) {
            document.documentElement.style.setProperty('--color-' + shade[i], 'var(--color-' + shade[i] + "-" + themeColor + ')');
        }
    }

    static updateAccentColor(accentColor?: string) {
        let userData = useUserDataStore();
        if(!accentColor) accentColor = userData.accentColor;
        
        if(accentColor.includes("easteregg")) {
            if(!Utils.cssTagForSpecialThemeColors) {
                let styles = `
                    .bg-accent { background-image: linear-gradient(135deg, var(--color-accent-1) 30%, var(--color-accent-2) 100%) !important; filter: brightness(110%) !important; }
                    .color-accent { background: linear-gradient(135deg, var(--color-accent-1) 6%, var(--color-accent-2) 100%) !important; filter: brightness(115%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; }
                `;

                Utils.cssTagForSpecialThemeColors = document.createElement("style");
                Utils.cssTagForSpecialThemeColors.innerText = styles;
                document.head.appendChild(Utils.cssTagForSpecialThemeColors);
            }

            let color1 = "#49B583", color2 = "#3c8adf";
            // let color1 = "#DF5C69", color2 = "#E594A9";
            // let color1 = "#D1CDFF", color2 = "#BEB9F4";
            //let color1 = "#D05575", color2 = "#DF5C69";
            if(accentColor == "easteregg2") { color1 = "#cb303b"; color2 = "#971d34"; }
            if(accentColor == "easteregg3") { color1 = "#D05575"; color2 = "#DF5C69"; }

            document.documentElement.style.setProperty('--color-accent-1', color1);
            document.documentElement.style.setProperty('--color-accent-2', color2);
        } else {
            if(!accentColor.includes("easteregg") && Utils.cssTagForSpecialThemeColors) {
                document.head.removeChild(Utils.cssTagForSpecialThemeColors);
                Utils.cssTagForSpecialThemeColors = undefined;
            }

            document.documentElement.style.setProperty('--color-accent-1', accentColor);
            document.documentElement.style.setProperty('--color-accent-2', accentColor);
        }
    }
}