import { ref } from "vue";
import { io } from "socket.io-client";

let serverUrl = "https://server.monufr.fr";
if(window.location.hostname.includes("localhost") || window.location.hostname.includes('192.168')) {
    //serverUrl = "http://192.168.1.4:10001"; // Use dev version
    serverUrl = "http://localhost:10001"; // Use dev version
    //serverUrl = "http://10.51.0.29:10001";
}

export const socket = io(serverUrl);
export const socketConnected = ref(false);

export function socketInit() {
    socket.connect();
}

socket.on("connect", () => {
    socketConnected.value = true;
});

socket.on("disconnect", () => {
    socketConnected.value = false;
});

