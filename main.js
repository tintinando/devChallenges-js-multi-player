import { Player } from "./Player.js"

const $ = selector => document.querySelector(selector)

const SONGS = [
    {
        author: "Cosmo Sheldrake",
        title: "Lost in the City Lights",
        duration: 72,
        cover: "cover-1.png",
        file: "lost-in-city-lights-145038.mp3"
    },
    {
        author: "Lesfm",
        title: "Forest Lullaby",
        duration: 138,
        cover: "cover-2.png",
        file: "forest-lullaby-110624.mp3"
    }
]

const player = new Player(SONGS, renderSong)

function renderSong() {
    const time = player.currentTime
    const duration = player.currentDuration
    const coverSrc = `/img/${SONGS[player.songIndex].cover}`
    const min = Math.floor(time / 60).toString().padStart(2, '0')
    const seg = Math.floor(time % 60).toString().padStart(2, '0')
    const minSong = Math.floor(duration / 60).toString().padStart(2, '0')
    const segSong = Math.floor(duration % 60).toString().padStart(2, '0')
    const progressWidth = time / duration * 100

    $(".player > img").src = coverSrc
    $(".player main h4").innerText = SONGS[player.songIndex].title
    $(".player main h6").innerText = SONGS[player.songIndex].author
    $(".player .progress label:nth-child(1)").innerText = `${min}:${seg}`
    $(".player .progress label:nth-child(2)").innerText = `${minSong}:${segSong}`
    $(".player .progress .progress-value").style.width = `${progressWidth}%`
}

const handleSeek = (e) => {
    const x = e.pageX - e.target.offsetLeft
    const totalWidth = e.target.offsetWidth
    const progress = x / totalWidth
    player.seek(progress)
}

$(".player #btn-prev").addEventListener("click", player.prev)
$(".player #btn-play").addEventListener("click", player.play)
$(".player #btn-fwd").addEventListener("click", player.fwd)
$(".player .progress").addEventListener("click", handleSeek)
