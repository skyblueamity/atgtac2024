<script setup lang="ts">
import axios from 'axios'
import {ref, onMounted} from 'vue'

// 名前一覧は全部文字列配列
type names = string[]
// 匁の情報で表示したい内容を定義
type monme = {
    locate: string, // 現地
    num: string, // 匁番号(特殊表記に対応したいので文字列)
    saku: names, // 作者一覧
    seban: names, // せばん一覧
    tape: names, // 現地班一覧
    tensai: names, // 甜菜一覧
    title: string, // 匁タイトル
    yusha: names // 勇者一覧
}
// GM一覧で定義したい内容
type gmList = {
  type: string, // GM種別(GM, デバッグ班, システム班, メインGM etc)
  GM: names // 種別に当てはまるGMの一覧
}

// 匁情報の一覧
const displayData = ref<monme[]>([])
// GM情報の一覧
const gmData = ref<gmList[]>([])
// 表示切替のフラグ
const show = ref(-1)
// スクロール位置の制御に使う変数
const scrollY = ref<number>(0)
// 読み込み完了の判定(表示開始用のクリック可否)
const getready = ref<boolean>(false)

// 読み込み完了時のアイコン切り替え
function tglid(): void {
    const icons = document.getElementById("iconstay");
    icons.style.display = "none";
    const iconb = document.getElementById("iconb");
    iconb.style.display = "block";
}
// スクロール開始処理
function startdown(): void {
    // 再生処理
    const myvideo: HTMLMediaElement = document.getElementById("bgvideo") as HTMLMediaElement;
    const mybgm: HTMLAudioElement = document.getElementById("bgm") as HTMLAudioElement;
    mybgm.volume = 0.05;
    myvideo.play();
    mybgm.play();
      // アイコン差し替え
      const iconb: HTMLElement = document.getElementById("iconb");
      iconb.style.display = "none";
      const icona: HTMLElement = document.getElementById("icona");
      icona.style.display = "block";
      show.value = 2;
      const step = 2.5;
      const interval = 25; // 0.025秒ごとに移動
      let now = 0;
      setInterval(
        function() {
          scrollBy(0, step); // スクロール位置を移動
          now++;
          if (now == 151) {
            now = 0;
          }
        }.bind(this),
        interval
      );
}
// スクロール処理本体
function handleScroll(): void {
    scrollY.value = window.scrollY;
    const media: HTMLMediaElement = document.getElementById("bgvideo") as HTMLMediaElement;
    media.playbackRate = 1;
    media.loop = true;
}

// Vue本体が読み込み終わった時点で開始される処理
onMounted(async() => {
    // スプシからデータ取得
    await axios.get('https://script.google.com/macros/s/AKfycbxbqrCk0R1GbWVV_W2yX7eNWbd6xJyD4V9cjeJG-4Iu2AKyLs5DSp-wr0hE7_fpgFvW/exec')
        .then(response => {
            displayData.value = response.data.data
            gmData.value = response.data.gm
        })
    // スクロールが開始できるよう背景動画も読み込む
    window.addEventListener("scroll", handleScroll);
    const media: HTMLMediaElement = document.getElementById("bgvideo") as HTMLMediaElement;
    let id = setInterval(
      function() {
        if (media.networkState == 1) {
          getready.value = true;
          tglid();
          clearInterval(id); //idをclearIntervalで指定している
        }
      },
      100
    );
})
</script>

<template>
  <div>
    <section>
      <video
        id="bgvideo"
        src="~@/assets/bvideo.mp4"
        type="video/mp4"
        webkit-playsinline
        playsinline
        muted
      ></video>
      <audio
        id="bgm"
        src="/src/assets/bgm.mp3"
        type="audio/mpeg"
        loop
      ></audio>
      <div id="icons" class="icondiv">
        <img class="star4" id="iconstay" src="~@/assets/logo_outline.png" />
        <img
          class="sticon"
          id="iconb"
          src="~@/assets/logo.png"
          v-on:click="startdown()"
          style="display: none;"
        />
        <img class="sticon" id="icona" src="~@/assets/logo_color.png" style="display: none;" />
      </div>
      <div v-if="displayData&&gmData&&show>=1&&getready">
        <div v-if="show==2">
          <div class="titlediv">
            <img class="sttitle" src="~@/assets/titleHeader.png" />
          </div>
          <div v-for="(display, index) in displayData" v-bind:key="index">
            <div class="mondai">
              <div class="monme">
                {{display.num}}: {{display.title}}
                <br />
                現地: {{display.locate}}
                <br />
              </div>
              <div v-if="display.saku" class="names">
                作問:
                <div>
                  <span
                    v-for="(sakumon, sakuIndex) in display.saku"
                    v-bind:key="display.num + sakuIndex + 'saku' + sakumon"
                  >
                  {{sakumon}}<br>
                  </span>
                </div>
                <br />現地班:
                <div>
                  <span
                    v-for="(tape, tapeIndex) in display.tape"
                    v-bind:key="display.num + tapeIndex + 'tape' + tape"
                  >
                  {{tape}}<br>
                  </span>
                </div>
                <br />セブン班:
                <div>
                  <span
                    v-for="(sevenHan, sebanIndex) in display.seban"
                    v-bind:key="display.num + sebanIndex + 'seban' + sevenHan"
                  >
                  {{sevenHan}}<br>
                  </span>
                </div>
                <br />甜菜:
                <div>
                  <span
                    v-for="(tensaisan, tensaiIndex) in display.tensai"
                    v-bind:key="display.num + tensaiIndex + 'tensai' + tensaisan"
                  >
                  {{tensaisan}}<br>
                  </span>
                </div>
                <br />勇者:
                  <div>
                    <span
                      v-for="(yushasama, yushaIndex) in display.yusha"
                      v-bind:key="display.num + yushaIndex + 'yusha' + yushasama"
                    >
                    {{yushasama}}<br>
                    </span>
                  </div>
              </div>
            </div>
          </div>
          <div v-for="members in gmData" v-bind:key="members.type">
            <p class="hd">{{members.type}}</p>
            <div class="gmname" v-for="gm in members.GM" v-bind:key="members.type + gm">{{gm}}</div>
          </div>
          <br />
          <br />
          <transition>
            <div id="owari" class="findiv">
              <img
                class="fin"
                src="~@/assets/fin.png"
              />
            </div>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://script.google.com/macros/s/AKfycbx2ARsCjHbDpAv_W677L-eT3XFWMFbwmz4GGd-igDniJsSrSn1YtHjyevUfzkt9KblN/exec");
.fontall {
  font-family: "M PLUS Rounded 1c", sans-serif;
  text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff,
    1px -1px 0 #fff, 0px 1px 0 #fff, 0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff;
}
.tback {
  /* width: 80vw; */
  font-size: 3rem;
  text-align: center;
}
.monme {
  /* width: 80vw; */
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  color: #75b39d;
  font-size: 1.2rem;
  text-align: center;
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-weight: bolder;
  text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff,
    1px -1px 0 #fff, 0px 1px 0 #fff, 0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff;
}
.names {
  /* width: 80vw; */
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  color: #f05783;
  font-size: 1.5rem;
  text-align: center;
  font-family: "M PLUS Rounded 1c", sans-serif;
  text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff,
    1px -1px 0 #fff, 0px 1px 0 #fff, 0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff;
}
.w3w {
  font-size: 0.9rem;
}
.gmname {
  /* width: 80vw; */
  color: #d4f2e8;
  font-size: 2rem;
  text-align: center;
  font-family: "M PLUS Rounded 1c", sans-serif;
  text-shadow: 1px 1px 0 #75b39d, -1px -1px 0 #75b39d, -1px 1px 0 #75b39d,
    1px -1px 0 #75b39d, 0px 1px 0 #75b39d, 0-1px 0 #75b39d, -1px 0 0 #75b39d, 1px 0 0 #75b39d;
}
.gmname1 {
  /* width: 80vw; */
  font-size: 2rem;
  color: #d4f2e8;
  text-align: center;
  font-family: "M PLUS Rounded 1c", sans-serif;
  text-shadow: 1px 1px 0 #75b39d, -1px -1px 0 #75b39d, -1px 1px 0 #75b39d,
    1px -1px 0 #75b39d, 0px 1px 0 #75b39d, 0-1px 0 #75b39d, -1px 0 0 #75b39d, 1px 0 0 #75b39d;
}
.hd {
  /* width: 80vw; */
  margin-top: 3rem;
  color: #ffd5eb;
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  font-family: "M PLUS Rounded 1c", sans-serif;
  text-shadow: 1px 1px 0 #f05783, -1px -1px 0 #f05783, -1px 1px 0 #f05783,
    1px -1px 0 #f05783, 0px 1px 0 #f05783, 0-1px 0 #f05783, -1px 0 0 #f05783, 1px 0 0 #f05783;
}
.flt {
  /* width: 80vw; */
  color: black;
  font-size: 1rem;
  text-align: center;
  font-family: "M PLUS Rounded 1c", sans-serif;
  text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, -1px 1px 0 #fff,
    1px -1px 0 #fff, 0px 1px 0 #fff, 0-1px 0 #fff, -1px 0 0 #fff, 1px 0 0 #fff;
}
.icondiv {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d9b3b4;
  margin: 0;
}
.titlediv, .findiv {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.sttitle {
  display: flex;
  justify-content: center;
  width: 90vw;
}
.fin {
  width: 80vw;
  margin-bottom:3rem;
}
.mac {
  width: 50vw;
}
.sticon {
  width: 30vw;
}
video {
  object-fit: cover;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  -moz-background-size: 100vw 100vh;
  background-size: 100vw 100vh;
  z-index: -1;
}
.header-title {
  position: relative; /*必ず必要*/
  z-index: 2; /*必ず必要*/
  display: flex;
  width: 50%;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: auto;
}
section {
  width: 100%;
  height: auto;
  position: relative;
  overflow: hidden;
}
.mondai {
  margin-bottom: 3rem;
  margin-top: 3rem;
}
.star4 {
  width: 30vw;
  animation: r4 60s steps(60) infinite;
}
@keyframes r4 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>