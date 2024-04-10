<template>
    <div class="base">
        <PageHeader title="Scanner un QrCode" />

        <!-- Explanation text -->
        <Text v-if="!cameraAutorized" class="mt-6 color-900">
            Pour scanner le QR code vous devez autoriser l'accés à la caméra de votre appareil.
            <br /><br />
            <span class="color-accent"> Note:</span> cette autorisation ne sera valable qu'une seule fois, et une bulle de notification
            apparait toujours lors de l'utilisation de la caméra.
        </Text>

        <!-- Allow camera acces button -->
        <div @click="startScanning" v-if="!cameraAutorized" class="mt-6 p-6 bg-accent rounded-3xl flex items-center">
            <Camera class="h-16 aspect-square" />
            <Text class="text-center color-900 ml-6"> Autoriser l'accès à la caméra </Text>
        </div>

        <router-link v-if="!cameraAutorized" to="/new-planning/how-to" class="bg-200 rounded-3xl flex p-6 mt-6 items-center">
            <Help class="h-16 aspect-square" />
            <Text class="color-900 ml-6"> Trouver mon QrCode </Text>
        </router-link>

        <!-- Video feedback -->
        <div class="flex flex-col items-center">
            <video :class="{ hidden: !cameraAutorized }" ref="videoObject" class="bg-200 rounded-3xl mt-6 max-h-[300px] min-h-[300px] w-fit"></video>
        </div>

        <div @click="scan" v-if="cameraAutorized" class="mt-6 p-6 bg-accent rounded-3xl">
            <Text v-if="!displayLoader" class="text-center color-900 ml-6 m-auto"> Scanner </Text>
            <SpinningRing v-if="displayLoader" class="m-auto" />
        </div>

        <!-- Error message -->
        <Text class="text-red-500 mt-6 text-center" v-if="!displayLoader && cameraError"> {{ cameraError }} </Text>

        <!-- Camera selector -->
        <div v-if="cameraAutorized" class="bg-200 p-6 rounded-3xl flex flex-col gap-6 h-fit overflow-auto mt-6">
            <div :class="{ 'pl-6 bg-accent': selectedCamera == index }" class="duration-300 p-6 bg-300 rounded-3xl flex flex-row" v-for="cameraId, index in cameraAvailable" @click="useCam(index)">
                <Camera class="h-14" />
                <Text class="duration-300 color-900 ml-6 m-auto"> Utiliser la camera {{ index }}</Text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onUnmounted, ref, type Ref } from "vue";
    import router from "@/router/router";

    import Planning from "@/static/planning-downloader";

    import PageHeader from "@/components/general/PageHeader.vue";

    import Text from '@/ui/text/Text.vue';

    import Camera from '@/assets/icons/Camera.vue';

    import SpinningRing from '@/components/animations/SpinningRing.vue';

    import Help from '@/assets/icons/Help.vue';

    const cameraAutorized = ref(false);
    const displayLoader = ref(false);
    const cameraError = ref("");

    const videoObject: Ref<any> = ref();
    const cameraAvailable: Ref<Array<string>> = ref([]);

    const selectedCamera = ref(-1);

    let cameraVideoSource: any = false;

    function startScanning() {
        cameraError.value = "";

        if("mediaDevices" in navigator) {
            if("ImageCapture" in window) {
                if("BarcodeDetector" in window) {
                    // List cameras and microphones.
                    navigator.mediaDevices.enumerateDevices().then((devices) => {
                        for(let i = 0; i < devices.length; i++) {
                            if(devices[i].kind == 'videoinput') {
                                cameraAvailable.value.push(devices[i].deviceId);
                            }
                        }
                    });

                    useCam(0);
                } else {
                    cameraError.value = "Cette fonction n'est pas disponible sur votre appareil. Code 0x3";
                }
            } else {
                cameraError.value = "Cette fonction n'est pas disponible sur votre appareil. Code: 0x2";
            }
        } else {
            cameraError.value = "Cette fonction n'est pas disponible sur votre appareil. Code: 0x1";
        }
    }

    function useCam(camIndex: number) {
        let lastCam = selectedCamera.value;

        selectedCamera.value = camIndex;
        cameraError.value = '';

        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                deviceId: {
                    exact: cameraAvailable.value[camIndex],
                },
            },
        }).then((stream) => {
            cameraAutorized.value = true;
            cameraVideoSource = stream;

            videoObject.value.srcObject = cameraVideoSource;
            videoObject.value.play();
        }).catch((error) => {
            selectedCamera.value = lastCam;

            if(error.name == 'NotReadableError') cameraError.value = "Cette camera est inutilisable pour le moment !";
            else cameraError.value = "Vous devez accepter l'utilisation de la caméra pour lire le QR code.";
        });
    }

    async function scan(event: Event) {
        if(displayLoader.value == true) return false;

        cameraError.value = "";
        displayLoader.value = true;

        if(cameraAutorized.value) {
            let track = cameraVideoSource.getVideoTracks()[0];

            // @ts-ignore: Unreachable code error
            let imageCapture = new ImageCapture(track);
            let blobPhoto = await imageCapture.grabFrame();

            // @ts-ignore: Unreachable code error
            new BarcodeDetector({formats: ['qr_code']}).detect(blobPhoto).then(async (barcodes) => {
                if(barcodes.length > 1) {
                    cameraError.value = "Trop d'éléments présent sur la photo.";
                    displayLoader.value = false;
                    return false;
                }

                if(barcodes.length == 0) {
                    cameraError.value = "Aucun QR conde détécté";
                    displayLoader.value = false;
                    return false;
                }

                if(barcodes[0].rawValue.includes('http://') || barcodes[0].rawValue.includes('https://')) {
                    await addPlanning(barcodes[0].rawValue);
                } else {
                    cameraError.value = "QR code invalide !";
                    displayLoader.value = false;
                    return false;
                }
            }).catch((err: Error) => {
                cameraError.value = "Une erreur s'est produite. Veuillez réessayer plus tard.";
                displayLoader.value = false;
                return false;
            });
        }
    }

    async function addPlanning(url: string) {
        let result = await Planning.addPlanning(url);
        if(result.succes == false) {
            cameraError.value = result.msg;
            displayLoader.value = false;
            return false;
        }

        router.go(-2);
    }

    onUnmounted(() => {
        if(cameraVideoSource != false) {
            cameraVideoSource.getTracks().forEach((track: any) => {
                track.stop();
            });
        }
    });
</script>

<style scoped>

</style>@/static/planning-downloader