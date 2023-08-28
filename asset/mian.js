const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STRO_KEY = 'CHAU_PLAYER'

const player = $('.player')

const cd = $('.img')
const heading = $('h2')
const cdThumb = $('.img')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const proggress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.play-list')
const settingBtn = $('.btn-settings')
const closeBtn = $('.btn-close')
const dasboard = $('.dasboard')

let timeStatus = 'stopped'

const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem('PLAYER_STRO_KEY')) || {}, 
    songs: [
        {
            name: 'Cupid',
            author: 'FITTY FITTY',
            img: 'img/Cupid.jpg',
            song: './music/Cupid.mp3'
        },
        {
            name: 'Gee',
            author: 'SNSD',
            img: 'img/Gee2.jpg',
            song: './music/Gee.mp3'
        },
        {
            name: 'Solo',
            author: 'Jennie',
            img: 'img/Solo.png',
            song: './music/Solo.mp3'
        },
        {
            name: 'Lion Heart',
            author: 'SNSD',
            img: 'img/Lion.jpg',
            song: './music/Lionheart.mp3'
        },
        {
            name: 'Flower',
            author: 'Jisoo',
            img: 'img/Flower.jpg',
            song: './music/Flower.mp3'
        },
        {
            name: 'Fake Love',
            author: 'BTS',
            img: 'img/Fake.jpg',
            song: './music/Fake.mp3'
        },
        {
            name: 'Heart shaker',
            author: 'Twice',
            img: 'img/Heartshaker.jpg',
            song: './music/Heartshaker.mp3'
        },
        {
            name: 'Likey',
            author: 'Twice',
            img: 'img/Likey.jpg',
            song: './music/Likey.mp3'
        },
        {
            name: 'Lạc Trôi',
            author: 'Sơn Tùng M-TP',
            img: 'img/Lactroi.jpg',
            song: './music/Lactroi.mp3'
        },
        {
            name: 'Chúng Ta Không Thuộc Về Nhau',
            author: 'Sơn Tùng M-TP',
            img: 'img/Nang.jpg',
            song: './music/Chungtakhongthuocvenhau.mp3'
        },
        {
            name: 'Em Của Ngày Hôm Qua',
            author: 'Sơn Tùng M-TP',
            img: 'img/Emcua.jpg',
            song: './music/Emcuangayhomqua.mp3'
        },
        {
            name: 'Hãy Trao Cho Anh',
            author: 'Sơn Tùng M-TP',
            img: 'img/Haytrao.jpg',
            song: './music/Haytraochoanh.mp3'
        },
        {
            name: 'Bad Boy',
            author: 'Red Velvet',
            img: 'img/Badboy.jpg',
            song: './music/Badboy.mp3'
        }

    ],
    setttings: function (key, value) {
        this.config[key] = value
        localStorage.setItem('PLAYER_STRO_KEY', JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === app.currentIndex ? 'active-song' : ''}" data-index="${index}">
                    <div class="thumb">
                    <img class="img-list" src="${song.img}" alt="CUPID">
                </div>
                <div class="body">
                <h3 class="tittle">${song.name}</h3>
                <p class="author">${song.author}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProper: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const cdwidth = cd.offsetWidth

        // Xử lý cd quay đĩa và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            easing: 'linear',
            fill: 'forwards',
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ ảnh
        window.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdwidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdwidth;
        }

        // Xử lý music khi click play
        playBtn.onclick = function() { 
                if(timeStatus == 'stopped') {
                    $('#pause').style.display = 'block'
                    $('#play').style.display = 'none'
                    audio.play()
                    cdThumbAnimate.play()
                    timeStatus = 'started'
                }else {
                    $('#pause').style.display = 'none'
                    $('#play').style.display = 'block'
                    audio.pause() 
                    cdThumbAnimate.pause()        
                    timeStatus = 'stopped'
                }
        }

        // Chạy theo tiến độ của bài hát
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progresPer = Math.floor(audio.currentTime / audio.duration * 100);
                proggress.value = progresPer
            }
        };

        // Xử lý khi Tua nhạc
        proggress.onchange = function () {
            audio.currentTime = proggress.value * audio.duration / 100
        }

        // Xử lý khi click next
        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
            }else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }
        prevBtn.onclick = function() {
            if(app.isRandom) {
                app.playRandomSong()
            }else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lý Khi để random Song
        randomBtn.onclick = function(e) {
            app.isRandom = !app.isRandom
            app.setttings('isRandom', app.isRandom)
            randomBtn.classList.toggle('active', app.isRandom)
        }

        // Xử lý next Song khi kết thúc bài hat
        audio.onended = function() {
            if(app.isRepeat){
                audio.play()
            }else {
                nextBtn.click();
            }
        }

        // Xử lý khi click repeat
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            app.setttings('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }


        // Lắng nghe click vào playList
        playList.onclick = function(e) {
            const songNde = e.target.closest('.song:not(.active-song)')
            // xử lý khi ko click vào tk đang active-song trừ tk option
            if(songNde || e.target.closest('.option')) {
                // xử lý khi click vào Song
                if(songNde) {
                    app.currentIndex = Number(songNde.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }

                //Xử lý khi click vào option
                if(e.target.closest('.option')){}

            }
        }

        settingBtn.onclick = function() {
            $('.js_model').style.display = 'block';
            $('html').style.overflow = 'hidden';
        }

        closeBtn.addEventListener('click', this.hidenSetting);
        $('.js_model').addEventListener('click', this.hidenSetting);
        $('.model__container').addEventListener('click', function(e){
            e.stopPropagation();
        })

        $('#BR1').onclick = function() {
            dasboard.style.backgroundImage = 'linear-gradient(to right, #2ecc71, #f1c40f)';
            $('.active-song').style.backgroundImage = 'linear-gradient(to right, #2980b9, #ffffff)';
        }
        $('#BR2').onclick = function() {
            dasboard.style.backgroundImage = 'linear-gradient(to right, #000000, #2ecc71)';
            $('.active-song').style.backgroundImage = 'linear-gradient(to right, #ff4388, #ff6d00)';
        }
        $('#BR3').onclick = function() {
            dasboard.style.backgroundImage = 'linear-gradient( to bottom,#7E85FF, #FF4F78)';
            $('.active-song').style.backgroundImage = 'linear-gradient(#FFAF00 , #FFD700)';
        }
        $('#BR4').onclick = function() {
            dasboard.style.backgroundImage = 'linear-gradient(to bottom, #2980b9, #ffffff)';
            $('.active-song').style.backgroundImage = 'linear-gradient( to bottom,#7E85FF, #FF4F78)';
        }

    },
    scrollToActiveSong: function() {
        setTimeout(function() {
            $('.song.active-song').scrollIntoView({
                behavior:'smooth',
                inline: "nearest",
            })
        }, 200)
    },
    hidenSetting: function() {
        $('.js_model').style.display = 'none';
        $('html').style.overflow = 'auto';
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.src = this.currentSong.img
        audio.src = this.currentSong.song
    },
    loadCondig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
          this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
          this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)

        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Gán cấu hình từ config vào object app 
        this.loadCondig()
        // Định nghĩa các thuộc tính cho object
        this.defineProper()

        // lắng nghe / xử lý các sự kiện dom event
        this.handleEvent()

        // Tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // render ra giao dien
        this.render()

        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }

}

app.start()