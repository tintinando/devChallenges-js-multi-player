export class Player {
    /**
     * 
     * @param {Object[]} songs
     * @param {function} render
     */
    constructor(songs, callback) {
        this.songs = songs
        this.callback = callback
        this.currentSongIndex = 0
        this.audio = null
        this.ROUTE_PREFIX = '/music'
        this.timeoutFwd = null

        this.play = this.play.bind(this)
        this.prev = this.prev.bind(this)
        this.fwd = this.fwd.bind(this)
        this.seek = this.seek.bind(this)
        this.kbSeek = this.kbSeek.bind(this)
        this.listenUpdate = this.listenUpdate.bind(this)

        document.addEventListener("keyup", this.kbSeek)
    }

    get currentSong() {
        return this.songs[this.currentSongIndex]
    }

    get currentDuration() {
        return this.audio ? this.audio.duration : 0
    }

    get currentTime() {
        return this.audio ? this.audio.currentTime : 0
    }

    get songIndex() {
        return this.currentSongIndex
    }

    setRoutePrefix(route) {
        this.ROUTE_PREFIX = route
    }

    listenUpdate() {
        if (this.audio.ended) {
            this.timeoutFwd = setTimeout(() => {
                this.fwd()
            }, 2000)
        }
        this.callback()
    }

    prev() {
        if (!this.audio) return
        this.audio.pause()

        if (this.audio.currentTime > 2) {
            this.audio.currentTime = 0
            this.audio.play()
            return
        }

        this.audio = null
        this.currentSongIndex = Math.max(0, this.currentSongIndex - 1)
        this.play()
    }

    play() {
        if (this.audio) {
            if (this.audio.paused) {
                this.audio.play()
            } else {
                this.audio.pause()
            }
            return
        }

        const audioFile = `${this.ROUTE_PREFIX}/${this.songs[this.currentSongIndex].file}`
        this.audio = new Audio(audioFile)
        this.audio.addEventListener("timeupdate", this.listenUpdate)
        this.audio.play()
    }

    fwd() {
        this.currentSongIndex = Math.min(this.currentSongIndex + 1, this.songs.length)
        this.audio?.pause()
        this.audio = null
        this.play()
    }

    /**
     * 
     * @param {number} progress
     */
    seek(progress, isSecond = false) {
        if (!this.audio) {
            this.play()
            return
        }

        this.audio.pause()
        if (isSecond) {
            this.audio.currentTime =
                Math.min(Math.max(this.audio.currentTime + progress, 0), this.currentDuration)
        } else {
            this.audio.currentTime = this.currentDuration * progress
        }

        this.audio.play()
    }


    kbSeek(e) {
        if (e.key === 'ArrowLeft') {
            this.seek(-5, true)
            return
        }

        if (e.key === 'ArrowRight') {
            this.seek(5, true)
            return
        }

        if (e.key === ' ') {
            this.play()
        }
    }

}