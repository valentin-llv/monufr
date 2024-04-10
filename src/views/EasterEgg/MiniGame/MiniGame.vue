<template>
    <div class="flex flex-col">
        <PageHeader title="Nom du jeu (Easter Egg)" />

        <div class="flex-1 flex flex-col overflow-auto pb-10 see-scroll">
            <canvas ref="canvas" class="ml-10 mr-10 mt-10 border-blue-500 border-2 aspect-square"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, type Ref } from "vue";
    import router from "@/router/router";

    import PageHeader from "@/components/general/PageHeader.vue";

    const canvas: Ref<undefined | HTMLCanvasElement> = ref();
        let game;
    onMounted(() => {
        game = new Game();
        game.play();

        console.log()
    });

    class Game {
        // @ts-ignore
        context: CanvasRenderingContext2D;

        height = 0;
        width = 0;

        floorPosY = 0.9;
        floorHeight = 0.1;
        floorColor = getComputedStyle(document.documentElement).getPropertyValue("--color-200");

        playerX = 0;
        playerY = 0;

        static _intance: Game | any;

        static getInstance() {
            if(!Game._intance) Game._intance = new Game();
            return Game._intance;
        }

        constructor() {
            if(canvas.value == undefined) {
                router.go(-1);
                return;
            }

            this.width = canvas.value.width;
            this.height = canvas.value.height;
        
            this.context = canvas.value.getContext("2d") as CanvasRenderingContext2D;

            this.play();
        }

        init() {

        }

        play() {
            this.context.clearRect(0, 0, this.width, this.height);

            this.drawFloor();

            window.requestAnimationFrame((() => { this.play(); }));
        }

        drawFloor() {
            this.context.fillStyle = this.floorColor;
            this.context.fillRect(0, this.height * this.floorPosY, this.width, this.height * this.floorHeight);
        }
    }
</script>

<style scoped>

</style>