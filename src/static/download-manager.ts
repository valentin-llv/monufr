import { socket } from "@/socket/socket";
import globalVars from "./globalVars";

export default class DownloadManager {
    static downloadRowPlanning(url: string): Promise<DownloadRessourceSucces | DownloadRessourceError> {
        return new Promise((resolve) => {
            let timeoutId =  setTimeout(() => {
                socket.off('downloadPlanning');
                resolve({
                    code: 7 // External request timeout
                });
            }, globalVars.onlineRequestTimeout);
            
            socket.on('downloadPlanning', (data) => {
                clearTimeout(timeoutId);
                socket.off('downloadPlanning');

                if(!data.succes) resolve({
                    code: 8, // Server reponded with an error
                });
                
                resolve({
                    content: data.data,
                });
            });
    
            socket.emit('downloadPlanning', { url: url });
        });
    }
}

export interface DownloadRessourceSucces {
    content: string,
}

export interface DownloadRessourceError {
    code: 7 | 8,
}