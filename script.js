// TikTik - YouTube Clone Application
// Pure JavaScript implementation with local storage persistence

class TikTikApp {
    constructor() {
        this.currentVideo = null;
        this.currentPage = 'home';
        this.sidebarCollapsed = false;
        this.settings = this.loadSettings();
        this.watchHistory = this.loadWatchHistory();
        this.likedVideos = this.loadLikedVideos();
        this.savedVideos = this.loadSavedVideos();
        this.comments = this.loadComments();
        this.myVideos = this.loadMyVideos();
        this.channelData = this.loadChannelData();
        this.myShorts = this.loadMyShorts();
        this.liveStreams = this.loadLiveStreams();
        this.cameraStream = null;
        this.isCameraOn = false;
        this.isMicOn = false;

        // Video data with proper working thumbnail URLs
        this.videos = [
            {
                id: '1',
                title: 'Amazing Sunset Timelapse - Nature\'s Beauty Unveiled',
                channel: 'NatureFilms HD',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face',
                thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=180&fit=crop',
                duration: '4:23',
                views: '1.2M views',
                uploadTime: '2 days ago',
                likes: 24580,
                description: 'Experience the breathtaking beauty of nature with this stunning sunset timelapse captured over the Pacific Ocean.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                category: 'general'
            },
            {
                id: '2',
                title: 'Modern Web Development Tutorial - React & JavaScript',
                channel: 'CodeMaster',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
                thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&h=180&fit=crop',
                duration: '45:17',
                views: '856K views',
                uploadTime: '1 week ago',
                likes: 18750,
                description: 'Learn modern web development with React, JavaScript ES6+, and best practices for building scalable applications.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                category: 'learning'
            },
            {
                id: '3',
                title: 'Epic Gaming Moments - Best Highlights 2024',
                channel: 'GameWorld Pro',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
                thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=320&h=180&fit=crop',
                duration: '12:45',
                views: '2.1M views',
                uploadTime: '3 days ago',
                likes: 45620,
                description: 'The most incredible gaming moments and epic wins from top streamers around the world.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                category: 'gaming'
            },
            {
                id: '4',
                title: 'Healthy Morning Routine - Transform Your Life',
                channel: 'Wellness Journey',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
                thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=320&h=180&fit=crop',
                duration: '8:32',
                views: '745K views',
                uploadTime: '5 days ago',
                likes: 12340,
                description: 'Start your day right with this simple yet effective morning routine that will boost your energy and productivity.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                category: 'general'
            },
            {
                id: '5',
                title: 'Latest Music Hits 2024 - Top Songs Compilation',
                channel: 'MusicVibes',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
                thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=320&h=180&fit=crop',
                duration: '25:18',
                views: '3.4M views',
                uploadTime: '1 day ago',
                likes: 67890,
                description: 'The hottest music tracks of 2024 featuring popular artists and trending songs.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                category: 'music'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.loadHomePage();
        this.updateAdminSettings();
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Admin panel
        document.getElementById('adminPanelBtn').addEventListener('click', () => {
            this.openAdminPanel();
        });

        document.getElementById('closeAdminBtn').addEventListener('click', () => {
            this.closeAdminPanel();
        });

        // Video modal
        document.getElementById('closeVideoBtn').addEventListener('click', () => {
            this.closeVideoModal();
        });

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.performSearch();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Close modals on backdrop click
        document.getElementById('videoModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeVideoModal();
            }
        });

        document.getElementById('adminModal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeAdminPanel();
            }
        });

        // Video player events
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.addEventListener('play', () => {
            if (this.currentVideo) {
                this.addToHistory(this.currentVideo);
            }
        });

        // Video player controls
        this.setupVideoControls();

        // Like/Dislike buttons
        document.getElementById('likeBtn').addEventListener('click', () => {
            this.toggleLike();
        });

        document.getElementById('dislikeBtn').addEventListener('click', () => {
            this.toggleDislike();
        });

        // Share, Save, Download buttons
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareVideo();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.toggleSave();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadVideo();
        });

        // Comment functionality
        document.getElementById('commentInput').addEventListener('focus', () => {
            this.showCommentActions();
        });

        document.getElementById('cancelComment').addEventListener('click', () => {
            this.hideCommentActions();
        });

        document.getElementById('submitComment').addEventListener('click', () => {
            this.submitComment();
        });

        document.getElementById('commentInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.submitComment();
            }
        });

        // Create button and modals
        document.getElementById('createBtn').addEventListener('click', () => {
            this.openCreateModal();
        });

        document.getElementById('closeCreateBtn').addEventListener('click', () => {
            this.closeCreateModal();
        });

        // Create options
        document.getElementById('uploadVideoOption').addEventListener('click', () => {
            this.closeCreateModal();
            this.openUploadModal();
        });

        document.getElementById('createShortOption').addEventListener('click', () => {
            this.closeCreateModal();
            this.openShortModal();
        });

        document.getElementById('goLiveOption').addEventListener('click', () => {
            this.closeCreateModal();
            this.openLiveModal();
        });

        // Upload modal
        document.getElementById('closeUploadBtn').addEventListener('click', () => {
            this.closeUploadModal();
        });

        document.getElementById('videoFileInput').addEventListener('change', (e) => {
            this.handleVideoFileSelect(e);
        });

        document.getElementById('publishVideoBtn').addEventListener('click', () => {
            this.publishVideo();
        });

        document.getElementById('cancelUploadBtn').addEventListener('click', () => {
            this.closeUploadModal();
        });

        // Channel edit modal
        document.getElementById('editChannelBtn').addEventListener('click', () => {
            this.openChannelEditModal();
        });

        document.getElementById('closeChannelEditBtn').addEventListener('click', () => {
            this.closeChannelEditModal();
        });

        document.getElementById('saveChannelBtn').addEventListener('click', () => {
            this.saveChannelChanges();
        });

        document.getElementById('cancelChannelEditBtn').addEventListener('click', () => {
            this.closeChannelEditModal();
        });

        // Channel tabs
        document.querySelectorAll('.channel-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchChannelTab(e.target.dataset.tab);
            });
        });

        // Short modal
        document.getElementById('closeShortBtn').addEventListener('click', () => {
            this.closeShortModal();
        });

        document.getElementById('shortFileInput').addEventListener('change', (e) => {
            this.handleShortFileSelect(e);
        });

        document.getElementById('publishShortBtn').addEventListener('click', () => {
            this.publishShort();
        });

        document.getElementById('cancelShortBtn').addEventListener('click', () => {
            this.closeShortModal();
        });

        // Live modal
        document.getElementById('closeLiveBtn').addEventListener('click', () => {
            this.closeLiveModal();
        });

        document.getElementById('startLiveBtn').addEventListener('click', () => {
            this.startLiveStream();
        });

        document.getElementById('cancelLiveBtn').addEventListener('click', () => {
            this.closeLiveModal();
        });

        document.getElementById('toggleCameraBtn').addEventListener('click', () => {
            this.toggleCamera();
        });

        document.getElementById('toggleMicBtn').addEventListener('click', () => {
            this.toggleMicrophone();
        });

        this.setupAdminControls();
    }

    setupVideoControls() {
        const videoPlayer = document.getElementById('videoPlayer');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');
        const timeDisplay = document.getElementById('timeDisplay');
        const muteBtn = document.getElementById('muteBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeFill = document.getElementById('volumeFill');

        // New YouTube-style controls
        const nextVideoBtn = document.getElementById('nextVideoBtn');
        const autoplayToggleBtn = document.getElementById('autoplayToggleBtn');
        const captionsBtn = document.getElementById('captionsBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsDropdown = document.getElementById('settingsDropdown');
        const miniplayerBtn = document.getElementById('miniplayerBtn');
        const theaterModeBtn = document.getElementById('theaterModeBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');

        // Player state controls
        const minimizeBtn = document.getElementById('minimizeBtn');
        const theaterBtn = document.getElementById('theaterBtn');
        const restoreBtn = document.getElementById('restoreBtn');

        // Navigation controls
        const prevVideoBtn = document.getElementById('prevVideoBtn');

        // Miniplayer controls
        const miniplayerPlayBtn = document.getElementById('miniplayerPlayBtn');

        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            if (videoPlayer.paused) {
                videoPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                miniplayerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                videoPlayer.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                miniplayerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        miniplayerPlayBtn.addEventListener('click', () => {
            playPauseBtn.click();
        });

        // Video player events
        videoPlayer.addEventListener('play', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            miniplayerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });

        videoPlayer.addEventListener('pause', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            miniplayerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        });

        // Progress bar
        videoPlayer.addEventListener('timeupdate', () => {
            if (videoPlayer.duration) {
                const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
                progressFill.style.width = progress + '%';

                const currentTime = this.formatTime(videoPlayer.currentTime);
                const duration = this.formatTime(videoPlayer.duration);
                timeDisplay.textContent = `${currentTime} / ${duration}`;
            }
        });

        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progress = clickX / rect.width;
            videoPlayer.currentTime = progress * videoPlayer.duration;
        });

        // Volume controls
        muteBtn.addEventListener('click', () => {
            if (videoPlayer.muted) {
                videoPlayer.muted = false;
                muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                volumeFill.style.width = (videoPlayer.volume * 100) + '%';
            } else {
                videoPlayer.muted = true;
                muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                volumeFill.style.width = '0%';
            }
        });

        volumeSlider.addEventListener('click', (e) => {
            const rect = volumeSlider.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const volume = clickX / rect.width;
            videoPlayer.volume = Math.max(0, Math.min(1, volume));
            volumeFill.style.width = (volume * 100) + '%';
            videoPlayer.muted = false;
            muteBtn.innerHTML = volume > 0 ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        });

        // Autoplay toggle
        autoplayToggleBtn.addEventListener('click', () => {
            this.settings.autoPlay = !this.settings.autoPlay;
            autoplayToggleBtn.classList.toggle('active', this.settings.autoPlay);
            autoplayToggleBtn.title = this.settings.autoPlay ? 'Autoplay is on' : 'Autoplay is off';
            this.saveSettings();
        });

        // Captions toggle
        captionsBtn.addEventListener('click', () => {
            const isActive = captionsBtn.classList.toggle('active');
            document.getElementById('captionsStatus').textContent = isActive ? 'On' : 'Off';
            this.toggleCaptions(isActive);
        });

        // Settings dropdown
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.classList.toggle('active');
        });

        // Close settings dropdown when clicking outside
        document.addEventListener('click', () => {
            settingsDropdown.classList.remove('active');
        });

        // Settings items
        document.querySelectorAll('.settings-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const setting = e.currentTarget.dataset.setting;
                this.handleSettingChange(setting);
            });
        });

        // Miniplayer button
        miniplayerBtn.addEventListener('click', () => {
            this.minimizeVideo();
        });

        // Theater mode button
        theaterModeBtn.addEventListener('click', () => {
            this.toggleTheaterMode();
        });

        // Player state controls
        minimizeBtn.addEventListener('click', () => {
            this.minimizeVideo();
        });

        theaterBtn.addEventListener('click', () => {
            this.toggleTheaterMode();
        });

        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        restoreBtn.addEventListener('click', () => {
            this.restoreVideo();
        });

        // Navigation controls
        prevVideoBtn.addEventListener('click', () => {
            this.playPreviousVideo();
        });

        nextVideoBtn.addEventListener('click', () => {
            this.playNextVideo();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.currentVideo && document.getElementById('videoModal').classList.contains('active')) {
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        playPauseBtn.click();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        videoPlayer.currentTime = Math.max(0, videoPlayer.currentTime - 10);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        videoPlayer.currentTime = Math.min(videoPlayer.duration, videoPlayer.currentTime + 10);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
                        volumeFill.style.width = (videoPlayer.volume * 100) + '%';
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
                        volumeFill.style.width = (videoPlayer.volume * 100) + '%';
                        break;
                    case 'KeyM':
                        e.preventDefault();
                        muteBtn.click();
                        break;
                    case 'KeyF':
                        e.preventDefault();
                        fullscreenBtn.click();
                        break;
                    case 'KeyT':
                        e.preventDefault();
                        theaterBtn.click();
                        break;
                    case 'KeyI':
                        e.preventDefault();
                        minimizeBtn.click();
                        break;
                }
            }
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    minimizeVideo() {
        const modal = document.getElementById('videoModal');
        const minimizeBtn = document.getElementById('minimizeBtn');
        const miniplayerTitle = document.getElementById('miniplayerTitle');

        if (modal.classList.contains('minimized')) {
            return;
        }

        modal.classList.add('minimized');
        minimizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
        minimizeBtn.title = 'Restore';

        if (this.currentVideo) {
            miniplayerTitle.textContent = this.currentVideo.title;
        }

        this.showToast('Video minimized. Click to restore.', 'info');
    }

    restoreVideo() {
        const modal = document.getElementById('videoModal');
        const minimizeBtn = document.getElementById('minimizeBtn');

        modal.classList.remove('minimized');
        modal.classList.remove('theater');
        minimizeBtn.innerHTML = '<i class="fas fa-compress"></i>';
        minimizeBtn.title = 'Minimize';

        this.showToast('Video restored', 'info');
    }

    toggleTheaterMode() {
        const modal = document.getElementById('videoModal');
        const theaterBtn = document.getElementById('theaterBtn');

        if (modal.classList.contains('theater')) {
            modal.classList.remove('theater');
            theaterBtn.innerHTML = '<i class="fas fa-expand"></i>';
            theaterBtn.title = 'Theater mode';
            this.showToast('Theater mode disabled', 'info');
        } else {
            modal.classList.remove('minimized');
            modal.classList.add('theater');
            theaterBtn.innerHTML = '<i class="fas fa-compress"></i>';
            theaterBtn.title = 'Exit theater mode';
            this.showToast('Theater mode enabled', 'info');
        }
    }

    toggleFullscreen() {
        const videoPlayer = document.getElementById('videoPlayer');

        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen().catch(err => {
                this.showToast('Fullscreen not supported', 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }

    playPreviousVideo() {
        if (!this.currentVideo) return;

        const currentIndex = this.videos.findIndex(v => v.id === this.currentVideo.id);
        if (currentIndex > 0) {
            const prevVideo = this.videos[currentIndex - 1];
            this.switchToVideo(prevVideo);
            this.showToast('Playing previous video', 'info');
        } else {
            this.showToast('This is the first video', 'info');
        }
    }

    playNextVideo() {
        if (!this.currentVideo) return;

        const currentIndex = this.videos.findIndex(v => v.id === this.currentVideo.id);
        if (currentIndex < this.videos.length - 1) {
            const nextVideo = this.videos[currentIndex + 1];
            this.switchToVideo(nextVideo);
            this.showToast('Playing next video', 'info');
        } else {
            this.showToast('This is the last video', 'info');
        }
    }

    switchToVideo(video) {
        const videoPlayer = document.getElementById('videoPlayer');
        const wasPlaying = !videoPlayer.paused;

        this.currentVideo = video;

        // Update video source
        videoPlayer.src = video.videoUrl;

        // Update video info
        document.getElementById('modalVideoTitle').textContent = video.title;
        document.getElementById('modalChannelName').textContent = video.channel;
        document.getElementById('modalChannelAvatar').src = video.avatar;
        document.getElementById('modalVideoStats').textContent = `${video.views} • ${video.uploadTime}`;
        document.getElementById('modalVideoDescription').textContent = video.description;
        document.getElementById('likeCount').textContent = this.formatNumber(video.likes);
        document.getElementById('miniplayerTitle').textContent = video.title;

        // Update like button state
        const likeBtn = document.getElementById('likeBtn');
        if (this.likedVideos.includes(video.id)) {
            likeBtn.classList.add('active');
        } else {
            likeBtn.classList.remove('active');
        }

        // Update save button state
        const saveBtn = document.getElementById('saveBtn');
        if (this.savedVideos.includes(video.id)) {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            saveBtn.classList.add('active');
        } else {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
            saveBtn.classList.remove('active');
        }

        // Auto-play if was playing or autoplay is enabled
        if (wasPlaying || this.settings.autoPlay) {
            videoPlayer.play();
        }

        // Load comments and recommendations
        this.loadComments(video.id);
        this.loadRecommendedVideos(video);
    }

    setupAdminControls() {
        // Theme settings
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.settings.theme = e.target.value;
                    this.applyTheme();
                }
            });
        });

        // Other settings
        document.getElementById('autoPlay').addEventListener('change', (e) => {
            this.settings.autoPlay = e.target.checked;
        });

        document.getElementById('showDescriptions').addEventListener('change', (e) => {
            this.settings.showDescriptions = e.target.checked;
        });

        document.getElementById('videosPerPage').addEventListener('change', (e) => {
            this.settings.videosPerPage = parseInt(e.target.value);
        });

        // Action buttons
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        document.getElementById('resetSettingsBtn').addEventListener('click', () => {
            this.resetSettings();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        this.sidebarCollapsed = !this.sidebarCollapsed;

        if (this.sidebarCollapsed) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    }

    navigateToPage(page) {
        // Remove active class from all nav items and pages
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

        // Add active class to current nav item and page
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        document.getElementById(`${page}Page`).classList.add('active');

        this.currentPage = page;

        // Load page content
        switch(page) {
            case 'home':
                this.loadHomePage();
                break;
            case 'trending':
                this.loadTrendingPage();
                break;
            case 'subscriptions':
                this.loadSubscriptionsPage();
                break;
            case 'library':
                this.loadLibraryPage();
                break;
            case 'history':
                this.loadHistoryPage();
                break;
            case 'liked':
                this.loadLikedPage();
                break;
            case 'music':
                this.loadMusicPage();
                break;
            case 'sports':
                this.loadSportsPage();
                break;
            case 'gaming':
                this.loadGamingPage();
                break;
            case 'news':
                this.loadNewsPage();
                break;
            case 'learning':
                this.loadLearningPage();
                break;
            case 'settings':
                this.loadSettingsPage();
                break;
            case 'help':
                this.loadHelpPage();
                break;
            case 'feedback':
                this.loadFeedbackPage();
                break;
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        this.settings.theme = newTheme;
        this.applyTheme();
        this.saveSettings();
    }

    applyTheme() {
        const theme = this.settings.theme === 'auto' ? 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 
            this.settings.theme;

        document.documentElement.setAttribute('data-theme', theme);

        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    openAdminPanel() {
        document.getElementById('adminModal').classList.add('active');
        this.updateAdminSettings();
    }

    closeAdminPanel() {
        document.getElementById('adminModal').classList.remove('active');
    }

    updateAdminSettings() {
        // Update theme radio buttons
        document.querySelector(`input[name="theme"][value="${this.settings.theme}"]`).checked = true;

        // Update other settings
        document.getElementById('autoPlay').checked = this.settings.autoPlay;
        document.getElementById('showDescriptions').checked = this.settings.showDescriptions;
        document.getElementById('videosPerPage').value = this.settings.videosPerPage;
    }

    loadHomePage() {
        const grid = document.getElementById('videoGrid');
        grid.innerHTML = '';

        // Load videos based on settings
        const videosToShow = this.videos.slice(0, this.settings.videosPerPage);
        videosToShow.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadTrendingPage() {
        const grid = document.getElementById('trendingGrid');
        grid.innerHTML = '';

        // Sort videos by views (mock trending)
        const trendingVideos = [...this.videos].sort((a, b) => {
            const aViews = parseInt(a.views.replace(/[^\d]/g, ''));
            const bViews = parseInt(b.views.replace(/[^\d]/g, ''));
            return bViews - aViews;
        });

        trendingVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadSubscriptionsPage() {
        // Subscriptions page shows empty state by default
    }

    loadLibraryPage() {
        // Update channel info
        document.getElementById('channelName').textContent = this.channelData.name;
        document.getElementById('subscriberCount').textContent = `${this.channelData.subscribers} subscribers`;
        document.getElementById('videoCount').textContent = `${this.channelData.videoCount} videos`;
        document.getElementById('channelDescription').textContent = this.channelData.description;
        document.getElementById('joinDate').textContent = this.channelData.joinDate;
        document.getElementById('totalViews').textContent = this.formatNumber(this.channelData.totalViews);

        // Load user's videos
        this.loadMyVideos();
    }

    loadMyVideos() {
        const grid = document.getElementById('myVideosGrid');
        grid.innerHTML = '';

        if (this.myVideos.length === 0) {
            // Show upload prompt
            return;
        }

        this.myVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadHistoryPage() {
        const grid = document.getElementById('historyGrid');
        grid.innerHTML = '';

        if (this.watchHistory.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>No watch history</p>
                    <span>Videos you watch will appear here</span>
                </div>
            `;
            return;
        }

        this.watchHistory.forEach(videoId => {
            const video = this.videos.find(v => v.id === videoId);
            if (video) {
                const videoCard = this.createVideoCard(video);
                grid.appendChild(videoCard);
            }
        });
    }

    loadLikedPage() {
        const grid = document.getElementById('likedGrid');
        grid.innerHTML = '';

        if (this.likedVideos.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-thumbs-up"></i>
                    <p>No liked videos</p>
                    <span>Videos you like will appear here</span>
                </div>
            `;
            return;
        }

        this.likedVideos.forEach(videoId => {
            const video = this.videos.find(v => v.id === videoId);
            if (video) {
                const videoCard = this.createVideoCard(video);
                grid.appendChild(videoCard);
            }
        });
    }

    loadMusicPage() {
        const grid = document.getElementById('musicGrid');
        grid.innerHTML = '';

        const musicVideos = this.videos.filter(video => video.category === 'music');
        musicVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadSportsPage() {
        const grid = document.getElementById('sportsGrid');
        grid.innerHTML = '';

        const sportsVideos = this.videos.filter(video => video.category === 'sports');
        sportsVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadGamingPage() {
        const grid = document.getElementById('gamingGrid');
        grid.innerHTML = '';

        const gamingVideos = this.videos.filter(video => video.category === 'gaming');
        gamingVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadNewsPage() {
        const grid = document.getElementById('newsGrid');
        grid.innerHTML = '';

        const newsVideos = this.videos.filter(video => video.category === 'news');
        newsVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadLearningPage() {
        const grid = document.getElementById('learningGrid');
        grid.innerHTML = '';

        const learningVideos = this.videos.filter(video => video.category === 'learning');
        learningVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadSettingsPage() {
        // Initialize settings tabs
        this.setupSettingsTabs();
    }

    setupSettingsTabs() {
        // Settings tab navigation
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = tab.dataset.tab;
                this.switchSettingsTab(tabName);
            });
        });

        // Additional settings event listeners
        this.setupSettingsControls();
    }

    switchSettingsTab(tabName) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.settings-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.settings-tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-content`).classList.add('active');
    }

    setupSettingsControls() {
        // Language setting
        const languageSelect = document.getElementById('language');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.settings.language = e.target.value;
                this.saveSettings();
                this.applyLanguage(e.target.value);
                this.showToast('Language updated', 'success');
            });
        }

        // Location setting
        const locationSelect = document.getElementById('location');
        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                this.settings.location = e.target.value;
                this.saveSettings();
                this.showToast('Location updated', 'success');
            });
        }

        // Video quality setting
        const videoQualitySelect = document.getElementById('videoQuality');
        if (videoQualitySelect) {
            videoQualitySelect.addEventListener('change', (e) => {
                this.settings.videoQuality = e.target.value;
                this.saveSettings();
                this.applyVideoQuality(e.target.value);
                this.showToast('Video quality updated', 'success');
            });
        }

        // Download quality setting
        const downloadQualitySelect = document.getElementById('download-quality');
        if (downloadQualitySelect) {
            downloadQualitySelect.addEventListener('change', (e) => {
                this.settings.downloadQuality = e.target.value;
                this.saveSettings();
                this.showToast('Download quality updated', 'success');
            });
        }

        // Caption language setting
        const captionLanguageSelect = document.getElementById('caption-language');
        if (captionLanguageSelect) {
            captionLanguageSelect.addEventListener('change', (e) => {
                this.settings.captionLanguage = e.target.value;
                this.saveSettings();
                this.showToast('Caption language updated', 'success');
            });
        }

        // Caption size setting
        const captionSizeSelect = document.getElementById('caption-size');
        if (captionSizeSelect) {
            captionSizeSelect.addEventListener('change', (e) => {
                this.settings.captionSize = e.target.value;
                this.saveSettings();
                this.applyCaptionSize(e.target.value);
                this.showToast('Caption size updated', 'success');
            });
        }

        // All checkbox settings with enhanced functionality
        const checkboxSettings = [
            'restrictedMode', 'subscriptions-notif', 'recommended-notif', 'comment-notif', 
            'live-notif', 'pause-watch-history', 'pause-search-history', 'private-subscriptions',
            'private-playlists', 'private-liked', 'new-ui', 'ai-features', 'always-choose-quality',
            'autoplay-on-home', 'annotations', 'show-captions', 'data-saver', 'smart-downloads',
            'download-on-wifi', 'live-chat-enabled', 'chat-filter', 'high-contrast',
            'keyboard-navigation', 'screen-reader', 'double-tap-seek', 'zoom-to-fill',
            'ambient-mode', 'theater-mode', 'miniplayer-auto', 'picture-in-picture',
            'auto-quality', 'stable-volume', 'speed-controls', 'gesture-controls'
        ];

        checkboxSettings.forEach(settingId => {
            const checkbox = document.getElementById(settingId);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.settings[settingId] = e.target.checked;
                    this.saveSettings();
                    this.applySettingChange(settingId, e.target.checked);
                    this.showToast('Setting updated', 'success');
                });
            }
        });

        // Playback speed setting
        const playbackSpeedSelect = document.getElementById('playback-speed');
        if (playbackSpeedSelect) {
            playbackSpeedSelect.addEventListener('change', (e) => {
                this.settings.playbackSpeed = e.target.value;
                this.saveSettings();
                this.applyPlaybackSpeed(e.target.value);
                this.showToast('Playback speed updated', 'success');
            });
        }

        // Seek duration setting
        const seekDurationSelect = document.getElementById('seek-duration');
        if (seekDurationSelect) {
            seekDurationSelect.addEventListener('change', (e) => {
                this.settings.seekDuration = e.target.value;
                this.saveSettings();
                this.showToast('Seek duration updated', 'success');
            });
        }

        // Volume normalization slider
        const volumeSlider = document.getElementById('volume-normalization');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.settings.volumeNormalization = e.target.value;
                this.saveSettings();
                this.applyVolumeNormalization(e.target.value);
            });
        }

        // Add account button
        const addAccountBtn = document.querySelector('.add-account-btn');
        if (addAccountBtn) {
            addAccountBtn.addEventListener('click', () => {
                this.showGoogleLoginPopup();
            });
        }

        // Switch account functionality
        document.querySelectorAll('.account-item').forEach(item => {
            if (!item.classList.contains('active')) {
                item.addEventListener('click', () => {
                    this.switchAccount(item.dataset.accountId);
                });
            }
        });

        // Family Centre setup
        const familyCentreBtn = document.querySelector('.family-centre-info .btn-primary');
        if (familyCentreBtn) {
            familyCentreBtn.addEventListener('click', () => {
                this.setupFamilyCentre();
            });
        }

        // Payment method setup
        const addPaymentBtn = document.querySelector('.payment-methods .btn-primary');
        if (addPaymentBtn) {
            addPaymentBtn.addEventListener('click', () => {
                this.addPaymentMethod();
            });
        }

        // Data download request
        const requestDownloadBtn = document.querySelector('.data-info .btn-primary');
        if (requestDownloadBtn) {
            requestDownloadBtn.addEventListener('click', () => {
                this.requestDataDownload();
            });
        }

        // Account deletion
        const deleteAccountBtn = document.querySelector('.data-info .btn-danger');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.deleteAccount();
            });
        }

        // Feedback form
        const feedbackForm = document.querySelector('.feedback-form button');
        if (feedbackForm) {
            feedbackForm.addEventListener('click', () => {
                const category = document.getElementById('feedback-category').value;
                const text = document.getElementById('feedback-text').value.trim();

                if (!text) {
                    this.showToast('Please enter your feedback', 'error');
                    return;
                }

                this.submitFeedback(category, text);
                document.getElementById('feedback-text').value = '';
                this.showToast('Thank you for your feedback!', 'success');
            });
        }

        // Connect to TV button
        const connectTvBtn = document.querySelector('.tv-info .btn-primary');
        if (connectTvBtn) {
            connectTvBtn.addEventListener('click', () => {
                this.connectToTV();
            });
        }

        // History management buttons
        const clearWatchBtn = document.querySelector('.history-actions .btn-secondary:first-child');
        const clearSearchBtn = document.querySelector('.history-actions .btn-secondary:last-child');
        const deleteAllBtn = document.querySelector('.history-actions .btn-danger');

        if (clearWatchBtn) {
            clearWatchBtn.addEventListener('click', () => {
                this.clearWatchHistory();
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.clearSearchHistory();
            });
        }

        if (deleteAllBtn) {
            deleteAllBtn.addEventListener('click', () => {
                this.deleteAllActivity();
            });
        }

        // Help center links
        document.querySelectorAll('.help-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const helpType = link.querySelector('span').textContent;
                this.openHelpCenter(helpType);
            });
        });

        // Terms and policies
        document.querySelectorAll('.about-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTermsPolicy(link.textContent);
            });
        });

        // Notification preferences with advanced controls
        this.setupNotificationControls();

        // Accessibility features
        this.setupAccessibilityControls();

        // Load saved settings
        this.loadSettingsFromStorage();
    }

    // Enhanced functionality methods
    applyLanguage(language) {
        // Apply language changes to UI
        document.documentElement.setAttribute('lang', language);
        // In a real app, this would load translation files
    }

    applyVideoQuality(quality) {
        // Apply video quality to current player
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer && videoPlayer.src) {
            // Store current time and apply quality
            const currentTime = videoPlayer.currentTime;
            const wasPlaying = !videoPlayer.paused;

            // Apply quality setting
            videoPlayer.addEventListener('loadedmetadata', () => {
                videoPlayer.currentTime = currentTime;
                if (wasPlaying) videoPlayer.play();
            }, { once: true });
        }
    }

    applyCaptionSize(size) {
        const sizeMap = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.setProperty('--caption-size', sizeMap[size]);
    }

    applyPlaybackSpeed(speed) {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.playbackRate = parseFloat(speed);
        }
    }

    applyVolumeNormalization(level) {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.volume = level / 100;
        }
    }

    applySettingChange(settingId, value) {
        switch(settingId) {
            case 'high-contrast':
                document.body.classList.toggle('high-contrast', value);
                break;
            case 'keyboard-navigation':
                document.body.classList.toggle('keyboard-nav', value);
                break;
            case 'screen-reader':
                document.body.setAttribute('aria-live', value ? 'polite' : 'off');
                break;
            case 'double-tap-seek':
                this.enableDoubleTapSeek = value;
                break;
            case 'zoom-to-fill':
                this.enableZoomToFill = value;
                break;
            case 'ambient-mode':
                this.enableAmbientMode = value;
                break;
            case 'theater-mode':
                this.enableTheaterMode = value;
                break;
            case 'picture-in-picture':
                this.enablePictureInPicture = value;
                break;
            case 'data-saver':
                this.applyDataSaver(value);
                break;
        }
    }

    applyDataSaver(enabled) {
        if (enabled) {
            this.settings.videoQuality = '480p';
            this.settings.autoplay = false;
            this.showToast('Data saver enabled - Lower quality and autoplay disabled', 'info');
        }
    }

    // Account management
    showGoogleLoginPopup() {
        // Trigger Google login
        if (typeof signInWithGoogle === 'function') {
            signInWithGoogle();
        } else {
            this.showToast('Google login not available', 'error');
        }
    }

    switchAccount(accountId) {
        this.showToast('Switching account...', 'info');
        // In a real app, this would switch to the selected account
        setTimeout(() => {
            this.showToast('Account switched successfully', 'success');
        }, 1000);
    }

    setupFamilyCentre() {
        this.showToast('Opening Family Centre setup...', 'info');
        // Open family centre configuration
    }

    addPaymentMethod() {
        this.showToast('Opening payment method setup...', 'info');
        // Open payment method modal
    }

    requestDataDownload() {
        if (confirm('Request a download of your TikTik data? This may take some time to prepare.')) {
            this.showToast('Data download request submitted. You will be notified when ready.', 'success');
        }
    }

    deleteAccount() {
        const confirmText = prompt('To delete your account, type "DELETE" to confirm:');
        if (confirmText === 'DELETE') {
            if (confirm('This will permanently delete your account and all data. This action cannot be undone.')) {
                this.showToast('Account deletion process initiated. You will receive an email with next steps.', 'warning');
            }
        }
    }

    submitFeedback(category, text) {
        // Store feedback locally or send to server
        const feedback = {
            category,
            text,
            timestamp: new Date().toISOString(),
            userId: 'current-user'
        };

        let feedbacks = JSON.parse(localStorage.getItem('tiktik_feedbacks') || '[]');
        feedbacks.push(feedback);
        localStorage.setItem('tiktik_feedbacks', JSON.stringify(feedbacks));
    }

    connectToTV() {
        if ('presentation' in navigator) {
            this.showToast('Searching for available devices...', 'info');
            // Implement cast functionality
            setTimeout(() => {
                this.showToast('No compatible devices found nearby', 'warning');
            }, 2000);
        } else {
            this.showToast('TV casting not supported on this device', 'error');
        }
    }

    clearWatchHistory() {
        if (confirm('Clear all watch history? This action cannot be undone.')) {
            this.watchHistory = [];
            this.saveWatchHistory();
            this.showToast('Watch history cleared', 'success');
            if (this.currentPage === 'history') {
                this.loadHistoryPage();
            }
        }
    }

    clearSearchHistory() {
        if (confirm('Clear all search history?')) {
            localStorage.removeItem('tiktik_search_history');
            this.showToast('Search history cleared', 'success');
        }
    }

    deleteAllActivity() {
        if (confirm('Delete ALL activity including watch history, search history, comments, and interactions? This cannot be undone.')) {
            this.watchHistory = [];
            this.likedVideos = [];
            this.savedVideos = [];
            this.comments = {};

            localStorage.removeItem('tiktik_search_history');
            this.saveWatchHistory();
            this.saveLikedVideos();
            this.saveSavedVideos();
            this.saveComments();

            this.showToast('All activity deleted', 'success');
        }
    }

    openHelpCenter(helpType) {
        this.showToast(`Opening ${helpType}...`, 'info');
        // Open help modal or navigate to help section
    }

    openTermsPolicy(type) {
        this.showToast(`Opening ${type}...`, 'info');
        // Open terms/policy modal
    }

    setupNotificationControls() {
        // Advanced notification scheduling
        const notificationTime = document.getElementById('notification-time');
        if (notificationTime) {
            notificationTime.addEventListener('change', (e) => {
                this.settings.notificationTime = e.target.value;
                this.saveSettings();
                this.scheduleNotifications();
            });
        }

        // Notification sound selection
        const notificationSound = document.getElementById('notification-sound');
        if (notificationSound) {
            notificationSound.addEventListener('change', (e) => {
                this.settings.notificationSound = e.target.value;
                this.saveSettings();
                this.playNotificationPreview(e.target.value);
            });
        }
    }

    setupAccessibilityControls() {
        // Font size control
        const fontSizeSlider = document.getElementById('font-size');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                const size = e.target.value;
                document.documentElement.style.setProperty('--base-font-size', `${size}px`);
                this.settings.fontSize = size;
                this.saveSettings();
            });
        }

        // Motion reduction
        const reduceMotion = document.getElementById('reduce-motion');
        if (reduceMotion) {
            reduceMotion.addEventListener('change', (e) => {
                document.documentElement.style.setProperty('--animation-duration', e.target.checked ? '0s' : '0.3s');
                this.settings.reduceMotion = e.target.checked;
                this.saveSettings();
            });
        }
    }

    scheduleNotifications() {
        // Implementation for notification scheduling
        this.showToast('Notification preferences updated', 'success');
    }

    playNotificationPreview(sound) {
        // Play notification sound preview
        const audio = new Audio(`/sounds/${sound}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Fallback for when audio files are not available
        });
    }

    loadSettingsFromStorage() {
        // Load and apply all saved settings
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });
    }

    loadHelpPage() {
        // Help page content is already in HTML
    }

    loadFeedbackPage() {
        // Feedback page content is already in HTML
    }

    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.onclick = () => this.openVideoModal(video);

        card.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQuNSA5MEwxNjUgMTAyLjU5VjU3LjQxTDE0NC41IDkwWiIgZmlsbD0iIzk0QTNBOCIvPgo8L3N2Zz4K';">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="channel-info">
                    <img class="channel-avatar" src="${video.avatar}" alt="${video.channel}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGM0Y0RjYiLz4KPGF0aCBkPSJNMzIgMTZDMzguNjI3NyAxNiA0NCAyMS4zNzIzIDQ0IDI4QzQ0IDM0LjYyNzcgMzguNjI3NyA0MCAzMiA0MEMyNS4zNzIzIDQwIDIwIDM0LjYyNzcgMjAgMjhDMjAgMjEuMzcyMyAyNS4zNzIzIDE2IDMyIDE2WiIgZmlsbD0iIzk0QTNBOCIvPgo8L3N2Zz4K';">
                    <span class="channel-name">${video.channel}</span>
                </div>
                <div class="video-stats">${video.views} • ${video.uploadTime}</div>
            </div>
        `;

        return card;
    }

    openVideoModal(video) {
        this.currentVideo = video;
        const modal = document.getElementById('videoModal');
        const player = document.getElementById('videoPlayer');

        // Update video player
        player.src = video.videoUrl;

        // Update video info
        document.getElementById('modalVideoTitle').textContent = video.title;
        document.getElementById('modalChannelName').textContent = video.channel;
        document.getElementById('modalChannelAvatar').src = video.avatar;
        document.getElementById('modalVideoStats').textContent = `${video.views} • ${video.uploadTime}`;
        document.getElementById('modalVideoDescription').textContent = video.description;
        document.getElementById('likeCount').textContent = this.formatNumber(video.likes);

        // Update like button state
        const likeBtn = document.getElementById('likeBtn');
        if (this.likedVideos.includes(video.id)) {
            likeBtn.classList.add('active');
        } else {
            likeBtn.classList.remove('active');
        }

        // Update save button state
        const saveBtn = document.getElementById('saveBtn');
        if (this.savedVideos.includes(video.id)) {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            saveBtn.classList.add('active');
        } else {
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
            saveBtn.classList.remove('active');
        }

        // Load comments
        this.loadComments(video.id);

        // Load recommended videos
        this.loadRecommendedVideos(video);

        modal.classList.add('active');

        // Auto-play if enabled
        if (this.settings.autoPlay) {
            player.play();
        }
    }

    closeVideoModal() {
        const modal = document.getElementById('videoModal');
        const player = document.getElementById('videoPlayer');

        modal.classList.remove('active', 'minimized', 'theater');
        player.pause();
        player.src = '';

        // Reset control states
        document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-play"></i>';
        document.getElementById('miniplayerPlayBtn').innerHTML = '<i class="fas fa-play"></i>';
        document.getElementById('minimizeBtn').innerHTML = '<i class="fas fa-compress"></i>';
        document.getElementById('theaterBtn').innerHTML = '<i class="fas fa-expand"></i>';
        document.getElementById('speedBtn').textContent = '1x';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('volumeFill').style.width = '80%';

        this.currentVideo = null;
    }

    loadComments(videoId) {
        const commentsList = document.getElementById('commentsList');
        const videoComments = this.comments[videoId] || [];

        commentsList.innerHTML = '';

        if (videoComments.length === 0) {
            commentsList.innerHTML = `
                <div class="empty-state">
                    <p>No comments yet</p>
                    <span>Be the first to comment!</span>
                </div>
            `;
            return;
        }

        videoComments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });

        document.getElementById('commentCount').textContent = videoComments.length;
    }

    createCommentElement(comment) {
        const element = document.createElement('div');
        element.className = 'comment-item';

        element.innerHTML = `
            <img class="user-avatar-small" src="${comment.avatar}" alt="${comment.author}">
            <div class="comment-content">
                <div class="comment-author">
                    ${comment.author}
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions-bar">
                    <button class="comment-like-btn">
                        <i class="fas fa-thumbs-up"></i>
                        ${comment.likes || 0}
                    </button>
                    <button class="comment-reply-btn">Reply</button>
                </div>
            </div>
        `;

        return element;
    }

    loadRecommendedVideos(currentVideo) {
        const recommendedList = document.getElementById('recommendedList');
        recommendedList.innerHTML = '';

        // Get videos from same category or random videos
        const recommendations = this.videos
            .filter(video => video.id !== currentVideo.id)
            .slice(0, 5);

        recommendations.forEach(video => {
            const item = document.createElement('div');
            item.className = 'recommended-item';
            item.onclick = () => {
                this.closeVideoModal();
                setTimeout(() => this.openVideoModal(video), 100);
            };

            item.innerHTML = `
                <img class="recommended-thumbnail" src="${video.thumbnail}" alt="${video.title}">
                <div class="recommended-info">
                    <div class="recommended-title">${video.title}</div>
                    <div class="recommended-stats">${video.channel} • ${video.views}</div>
                </div>
            `;

            recommendedList.appendChild(item);
        });
    }

    performSearch() {
        const query = document.getElementById('searchInput').value.trim().toLowerCase();

        if (!query) return;

        this.showLoading();

        // Simulate search delay
        setTimeout(() => {
            const results = this.videos.filter(video => 
                video.title.toLowerCase().includes(query) ||
                video.channel.toLowerCase().includes(query) ||
                video.description.toLowerCase().includes(query)
            );

            this.displaySearchResults(results, query);
            this.hideLoading();
        }, 500);
    }

    displaySearchResults(results, query) {
        const grid = document.getElementById('videoGrid');
        grid.innerHTML = '';

        if (results.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No results for "${query}"</p>
                    <span>Try different keywords</span>
                </div>
            `;
            return;
        }

        results.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });

        // Update page title
        const homeTitle = document.querySelector('#homePage h2');
        if (!homeTitle) {
            const title = document.createElement('h2');
            title.textContent = `Search results for "${query}"`;
            document.getElementById('homePage').insertBefore(title, grid);
        } else {
            homeTitle.textContent = `Search results for "${query}"`;
        }

        // Navigate to home page to show results
        this.navigateToPage('home');
    }

    addToHistory(video) {
        // Remove if already exists
        this.watchHistory = this.watchHistory.filter(id => id !== video.id);

        // Add to beginning
        this.watchHistory.unshift(video.id);

        // Keep only last 50 videos
        if (this.watchHistory.length > 50) {
            this.watchHistory = this.watchHistory.slice(0, 50);
        }

        this.saveWatchHistory();
    }

    toggleLike() {
        if (!this.currentVideo) return;

        const likeBtn = document.getElementById('likeBtn');
        const videoId = this.currentVideo.id;

        if (this.likedVideos.includes(videoId)) {
            // Unlike
            this.likedVideos = this.likedVideos.filter(id => id !== videoId);
            likeBtn.classList.remove('active');
            this.showToast('Removed from liked videos', 'info');
        } else {
            // Like
            this.likedVideos.push(videoId);
            likeBtn.classList.add('active');
            this.showToast('Added to liked videos', 'success');
        }

        this.saveLikedVideos();
    }

    toggleDislike() {
        const dislikeBtn = document.getElementById('dislikeBtn');

        if (dislikeBtn.classList.contains('active')) {
            dislikeBtn.classList.remove('active');
        } else {
            dislikeBtn.classList.add('active');
            // Remove from liked if disliked
            if (this.currentVideo && this.likedVideos.includes(this.currentVideo.id)) {
                this.toggleLike();
            }
        }
    }

    shareVideo() {
        if (!this.currentVideo) return;

        const url = `${window.location.origin}?video=${this.currentVideo.id}`;

        if (navigator.share) {
            navigator.share({
                title: this.currentVideo.title,
                text: `Check out this video: ${this.currentVideo.title}`,
                url: url
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(url).then(() => {
                this.showToast('Link copied to clipboard', 'success');
            });
        }
    }

    toggleSave() {
        if (!this.currentVideo) return;

        const saveBtn = document.getElementById('saveBtn');
        const videoId = this.currentVideo.id;

        if (this.savedVideos.includes(videoId)) {
            // Remove from saved
            this.savedVideos = this.savedVideos.filter(id => id !== videoId);
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
            saveBtn.classList.remove('active');
            this.showToast('Removed from saved videos', 'info');
        } else {
            // Add to saved
            this.savedVideos.push(videoId);
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            saveBtn.classList.add('active');
            this.showToast('Saved to watch later', 'success');
        }

        this.saveSavedVideos();
    }

    downloadVideo() {
        if (!this.currentVideo) return;

        this.showToast('Download started', 'success');

        // Simulate download
        const link = document.createElement('a');
        link.href = this.currentVideo.videoUrl;
        link.download = `${this.currentVideo.title}.mp4`;
        link.click();
    }

    showCommentActions() {
        document.querySelector('.comment-actions').style.display = 'flex';
    }

    hideCommentActions() {
        document.querySelector('.comment-actions').style.display = 'none';
        document.getElementById('commentInput').value = '';
    }

    submitComment() {
        const commentInput = document.getElementById('commentInput');
        const commentText = commentInput.value.trim();

        if (!commentText || !this.currentVideo) return;

        const newComment = {
            id: Date.now(),
            author: 'You',
            avatar: 'https://pixabay.com/get/g1882a617f55023cde87198feea9e830686b0a69ae7f315295cebe2b111a575a3d2dd94672359c9d34b332edd722a8e7d502b680acae2e35040353fd2a2ee0f9a_1280.jpg',
            text: commentText,
            time: 'now',
            likes: 0
        };

        if (!this.comments[this.currentVideo.id]) {
            this.comments[this.currentVideo.id] = [];
        }

        this.comments[this.currentVideo.id].unshift(newComment);
        this.saveComments();

        // Refresh comments
        this.loadComments(this.currentVideo.id);

        // Clear input and hide actions
        this.hideCommentActions();

        this.showToast('Comment added', 'success');
    }

    openCreateModal() {
        document.getElementById('createModal').classList.add('active');
    }

    closeCreateModal() {
        document.getElementById('createModal').classList.remove('active');
    }

    openUploadModal() {
        document.getElementById('uploadModal').classList.add('active');
    }

    closeUploadModal() {
        document.getElementById('uploadModal').classList.remove('active');
        this.resetUploadForm();
    }

    resetUploadForm() {
        document.getElementById('uploadArea').style.display = 'block';
        document.getElementById('uploadForm').style.display = 'none';
        document.getElementById('videoTitle').value = '';
        document.getElementById('videoDescription').value = '';
        document.getElementById('videoCategory').value = 'general';
        document.getElementById('videoFileInput').value = '';
    }

    handleVideoFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            this.showToast('Please select a video file', 'error');
            return;
        }

        document.getElementById('uploadArea').style.display = 'none';
        document.getElementById('uploadForm').style.display = 'block';
        document.getElementById('videoTitle').value = file.name.replace(/\.[^/.]+$/, '');
    }

    publishVideo() {
        const title = document.getElementById('videoTitle').value.trim();
        const description = document.getElementById('videoDescription').value.trim();
        const category = document.getElementById('videoCategory').value;

        if (!title) {
            this.showToast('Please enter a title', 'error');
            return;
        }

        // Create new video object
        const newVideo = {
            id: Date.now().toString(),
            title: title,
            channel: this.channelData.name,
            avatar: 'https://pixabay.com/get/g1882a617f55023cde87198feea9e830686b0a69ae7f315295cebe2b111a575a3d2dd94672359c9d34b332edd722a8e7d502b680acae2e35040353fd2a2ee0f9a_1280.jpg',
            thumbnail: 'https://pixabay.com/get/g2d6e4de48b7bd3a87afab6e869007196adcc1cb3dfd663e6e585bcffd24c3260ab24ba71895df36ec3dc5902cba221c21d6918c76ffa1876e8ac616c437334eb_1280.jpg',
            duration: '0:00',
            views: '0 views',
            uploadTime: 'now',
            likes: 0,
            description: description,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            category: category
        };

        // Add to user's videos
        this.myVideos.push(newVideo);
        this.saveMyVideos();

        // Update channel stats
        this.channelData.videoCount = this.myVideos.length;
        this.saveChannelData();

        this.closeUploadModal();
        this.showToast('Video uploaded successfully!', 'success');

        // Refresh channel page if currently viewing
        if (this.currentPage === 'library') {
            this.loadLibraryPage();
        }
    }

    openChannelEditModal() {
        const modal = document.getElementById('channelEditModal');

        // Populate current values
        document.getElementById('editChannelName').value = this.channelData.name;
        document.getElementById('editChannelDescription').value = this.channelData.description;

        modal.classList.add('active');
    }

    closeChannelEditModal() {
        document.getElementById('channelEditModal').classList.remove('active');
    }

    saveChannelChanges() {
        const name = document.getElementById('editChannelName').value.trim();
        const description = document.getElementById('editChannelDescription').value.trim();

        if (!name) {
            this.showToast('Please enter a channel name', 'error');
            return;
        }

        this.channelData.name = name;
        this.channelData.description = description;

        this.saveChannelData();
        this.closeChannelEditModal();
        this.showToast('Channel updated successfully!', 'success');

        // Refresh if on library page
        if (this.currentPage === 'library') {
            this.loadLibraryPage();
        }
    }

    switchChannelTab(tab) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.channel-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}Tab`).classList.add('active');
    }

    openShortModal() {
        document.getElementById('shortModal').classList.add('active');
    }

    closeShortModal() {
        document.getElementById('shortModal').classList.remove('active');
        this.resetShortForm();
    }

    resetShortForm() {
        document.getElementById('shortUploadArea').style.display = 'block';
        document.getElementById('shortForm').style.display = 'none';
        document.getElementById('shortTitle').value = '';
        document.getElementById('shortDescription').value = '';
        document.getElementById('shortCategory').value = 'general';
        document.getElementById('shortFileInput').value = '';
    }

    handleShortFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            this.showToast('Please select a video file', 'error');
            return;
        }

        // Create video preview
        const preview = document.getElementById('shortPreview');
        preview.src = URL.createObjectURL(file);

        document.getElementById('shortUploadArea').style.display = 'none';
        document.getElementById('shortForm').style.display = 'flex';
        document.getElementById('shortTitle').value = file.name.replace(/\.[^/.]+$/, '');
    }

    publishShort() {
        const title = document.getElementById('shortTitle').value.trim();
        const description = document.getElementById('shortDescription').value.trim();
        const category = document.getElementById('shortCategory').value;

        if (!title) {
            this.showToast('Please enter a title', 'error');
            return;
        }

        // Create new short object
        const newShort = {
            id: Date.now().toString(),
            title: title,
            channel: this.channelData.name,
            avatar: 'https://pixabay.com/get/g1882a617f55023cde87198feea9e830686b0a69ae7f315295cebe2b111a575a3d2dd94672359c9d34b332edd722a8e7d502b680acae2e35040353fd2a2ee0f9a_1280.jpg',
            thumbnail: 'https://pixabay.com/get/g2d6e4de48b7bd3a87afab6e869007196adcc1cb3dfd663e6e585bcffd24c3260ab24ba71895df36ec3dc5902cba221c21d6918c76ffa1876e8ac616c437334eb_1280.jpg',
            duration: '0:30',
            views: '0 views',
            uploadTime: 'now',
            likes: 0,
            description: description,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            category: category,
            isShort: true
        };

        // Add to user's shorts
        this.myShorts.push(newShort);
        this.saveMyShorts();

        // Update channel stats
        this.channelData.videoCount = this.myVideos.length + this.myShorts.length;
        this.saveChannelData();

        this.closeShortModal();
        this.showToast('Short published successfully!', 'success');

        // Refresh channel page if currently viewing
        if (this.currentPage === 'library') {
            this.loadLibraryPage();
        }
    }

    openLiveModal() {
        document.getElementById('liveModal').classList.add('active');
        this.initializeCamera();
    }

    closeLiveModal() {
        document.getElementById('liveModal').classList.remove('active');
        this.stopCamera();
        this.resetLiveForm();
    }

    resetLiveForm() {
        document.getElementById('liveTitle').value = '';
        document.getElementById('liveDescription').value = '';
        document.getElementById('liveCategory').value = 'gaming';
        document.querySelector('input[name="livePrivacy"][value="public"]').checked = true;
    }

    async initializeCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const preview = document.getElementById('cameraPreview');
            preview.srcObject = stream;
            this.cameraStream = stream;
            this.isCameraOn = true;
            this.isMicOn = true;
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showToast('Camera access denied', 'error');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
            this.isCameraOn = false;
            this.isMicOn = false;
        }
    }

    toggleCamera() {
        if (!this.cameraStream) return;

        const videoTracks = this.cameraStream.getVideoTracks();
        videoTracks.forEach(track => {
            track.enabled = !track.enabled;
        });

        this.isCameraOn = !this.isCameraOn;
        const btn = document.getElementById('toggleCameraBtn');
        btn.innerHTML = this.isCameraOn ? '<i class="fas fa-video"></i> Camera' : '<i class="fas fa-video-slash"></i> Camera';
    }

    toggleMicrophone() {
        if (!this.cameraStream) return;

        const audioTracks = this.cameraStream.getAudioTracks();
        audioTracks.forEach(track => {
            track.enabled = !track.enabled;
        });

        this.isMicOn = !this.isMicOn;
        const btn = document.getElementById('toggleMicBtn');
        btn.innerHTML = this.isMicOn ? '<i class="fas fa-microphone"></i> Microphone' : '<i class="fas fa-microphone-slash"></i> Microphone';
    }

    startLiveStream() {
        const title = document.getElementById('liveTitle').value.trim();
        const description = document.getElementById('liveDescription').value.trim();
        const category = document.getElementById('liveCategory').value;
        const privacy = document.querySelector('input[name="livePrivacy"]:checked').value;

        if (!title) {
            this.showToast('Please enter a stream title', 'error');
            return;
        }

        // Create new live stream object
        const newLiveStream = {
            id: Date.now().toString(),
            title: title,
            channel: this.channelData.name,
            avatar: 'https://pixabay.com/get/g1882a617f55023cde87198feea9e830686b0a69ae7f315295cebe2b111a575a3d2dd94672359c9d34b332edd722a8e7d502b680acae2e35040353fd2a2ee0f9a_1280.jpg',
            thumbnail: 'https://pixabay.com/get/g2d6e4de48b7bd3a87afab6e869007196adcc1cb3dfd663e6e585bcffd24c3260ab24ba71895df36ec3dc5902cba221c21d6918c76ffa1876e8ac616c437334eb_1280.jpg',
            description: description,
            category: category,
            privacy: privacy,
            startTime: new Date().toISOString(),
            viewers: 0,
            isLive: true
        };

        // Add to live streams
        this.liveStreams.push(newLiveStream);
        this.saveLiveStreams();

        this.closeLiveModal();
        this.showToast('Live stream started successfully!', 'success');

        // In a real app, this would connect to a streaming server
        setTimeout(() => {
            this.showToast('Live stream ended', 'info');
        }, 5000);
    }

    clearHistory() {
        this.watchHistory = [];
        this.saveWatchHistory();
        this.showToast('Watch history cleared', 'success');

        if (this.currentPage === 'history') {
            this.loadHistoryPage();
        }
    }

    resetSettings() {
        this.settings = {
            theme: 'light',
            autoPlay: true,
            showDescriptions: true,
            videosPerPage: 20
        };
        this.saveSettings();
        this.applyTheme();
        this.updateAdminSettings();
        this.showToast('Settings reset to default', 'success');
    }

    saveSettings() {
        localStorage.setItem('tiktik_settings', JSON.stringify(this.settings));
        this.showToast('Settings saved', 'success');
    }

    // Data persistence methods
    loadSettings() {
        const saved = localStorage.getItem('tiktik_settings');
        return saved ? JSON.parse(saved) : {
            theme: 'light',
            autoPlay: true,
            showDescriptions: true,
            videosPerPage: 20
        };
    }

    loadWatchHistory() {
        const saved = localStorage.getItem('tiktik_history');
        return saved ? JSON.parse(saved) : [];
    }

    saveWatchHistory() {
        localStorage.setItem('tiktik_history', JSON.stringify(this.watchHistory));
    }

    loadLikedVideos() {
        const saved = localStorage.getItem('tiktik_liked');
        return saved ? JSON.parse(saved) : [];
    }

    saveLikedVideos() {
        localStorage.setItem('tiktik_liked', JSON.stringify(this.likedVideos));
    }

    loadSavedVideos() {
        const saved = localStorage.getItem('tiktik_saved_videos');
        return saved ? JSON.parse(saved) : [];
    }

    saveSavedVideos() {
        localStorage.setItem('tiktik_saved_videos', JSON.stringify(this.savedVideos));
    }

    loadComments() {
        const saved = localStorage.getItem('tiktik_comments');
        return saved ? JSON.parse(saved) : {};
    }

    saveComments() {
        localStorage.setItem('tiktik_comments', JSON.stringify(this.comments));
    }

    loadMyVideos() {
        const saved = localStorage.getItem('tiktik_my_videos');
        return saved ? JSON.parse(saved) : [];
    }

    saveMyVideos() {
        localStorage.setItem('tiktik_my_videos', JSON.stringify(this.myVideos));
    }

    loadChannelData() {
        const saved = localStorage.getItem('tiktik_channel_data');
        return saved ? JSON.parse(saved) : {
            name: 'My Channel',
            description: 'Welcome to my channel! Here you\'ll find amazing content.',
            subscribers: 0,
            videoCount: 0,
            joinDate: new Date().toLocaleDateString(),
            totalViews: 0
        };
    }

    saveChannelData() {
        localStorage.setItem('tiktik_channel_data', JSON.stringify(this.channelData));
    }

    loadMyShorts() {
        const saved = localStorage.getItem('tiktik_my_shorts');
        return saved ? JSON.parse(saved) : [];
    }

    saveMyShorts() {
        localStorage.setItem('tiktik_my_shorts', JSON.stringify(this.myShorts));
    }

    loadLiveStreams() {
        const saved = localStorage.getItem('tiktik_live_streams');
        return saved ? JSON.parse(saved) : [];
    }

    saveLiveStreams() {
        localStorage.setItem('tiktik_live_streams', JSON.stringify(this.liveStreams));
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    toggleCaptions(show) {
        const videoPlayer = document.getElementById('videoPlayer');

        if (show) {
            // Enable captions/subtitles
            if (videoPlayer.textTracks && videoPlayer.textTracks.length > 0) {
                for (let track of videoPlayer.textTracks) {
                    track.mode = 'showing';
                }
            }
            this.showToast('Captions enabled', 'info');
        } else {
            // Disable captions/subtitles
            if (videoPlayer.textTracks && videoPlayer.textTracks.length > 0) {
                for (let track of videoPlayer.textTracks) {
                    track.mode = 'hidden';
                }
            }
            this.showToast('Captions disabled', 'info');
        }
    }

    handleSettingChange(setting) {
        switch(setting) {
            case 'quality':
                this.showQualityMenu();
                break;
            case 'speed':
                this.showSpeedMenu();
                break;
            case 'captions':
                this.showCaptionsMenu();
                break;
        }
    }

    showQualityMenu() {
        const qualities = ['Auto', '2160p', '1440p', '1080p', '720p', '480p', '360p', '240p'];
        this.showSubMenu('Quality', qualities, 'Auto', (quality) => {
            document.getElementById('currentQuality').textContent = quality;
            this.setVideoQuality(quality);
        });
    }

    showSpeedMenu() {
        const speeds = ['0.25', '0.5', '0.75', 'Normal', '1.25', '1.5', '1.75', '2'];
        this.showSubMenu('Playback speed', speeds, 'Normal', (speed) => {
            document.getElementById('currentSpeed').textContent = speed;
            this.setPlaybackSpeed(speed);
        });
    }

    showCaptionsMenu() {
        const options = ['Off', 'English', 'Hindi', 'Spanish', 'French'];
        this.showSubMenu('Subtitles/CC', options, 'Off', (option) => {
            document.getElementById('captionsStatus').textContent = option;
            this.setCaptionLanguage(option);
        });
    }

    showSubMenu(title, options, current, callback) {
        const dropdown = document.getElementById('settingsDropdown');
        dropdown.innerHTML = `
            <div class="settings-item" onclick="this.parentElement.classList.remove('active')">
                <i class="fas fa-chevron-left"></i>
                <span>${title}</span>
            </div>
            ${options.map(option => `
                <div class="settings-item" data-value="${option}">
                    <span>${option}</span>
                    ${option === current ? '<i class="fas fa-check"></i>' : ''}
                </div>
            `).join('')}
        `;

        dropdown.querySelectorAll('[data-value]').forEach(item => {
            item.addEventListener('click', () => {
                callback(item.dataset.value);
                dropdown.classList.remove('active');
            });
        });
    }

    setVideoQuality(quality) {
        this.showToast(`Video quality set to ${quality}`, 'info');
    }

    setPlaybackSpeed(speed) {
        const videoPlayer = document.getElementById('videoPlayer');
        const speedValue = speed === 'Normal' ? 1 : parseFloat(speed);
        videoPlayer.playbackRate = speedValue;
        this.showToast(`Playback speed set to ${speed}`, 'info');
    }

    setCaptionLanguage(language) {
        if (language === 'Off') {
            this.toggleCaptions(false);
            document.getElementById('captionsBtn').classList.remove('active');
        } else {
            this.toggleCaptions(true);
            document.getElementById('captionsBtn').classList.add('active');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.remove('active');
    }
}

// Profile dropdown toggle function
  function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }

  // Click outside to close dropdown
  document.addEventListener('click', function(event) {
    const container = document.getElementById('profile-container');
    const menu = document.getElementById('profile-menu');
    if (!container.contains(event.target)) {
      menu.style.display = 'none';
    }
  });

  // Profile menu functions
  function switchAccount() {
    alert('Switch Account feature - You can add multiple accounts here');
    toggleProfileMenu();
  }

  function openTikTikStudio() {
    alert('Opening TikTik Studio - Content creation and analytics dashboard');
    toggleProfileMenu();
  }

  function openCreatorAcademy() {
    alert('Opening Creator Academy - Learn content creation tips and tricks');
    toggleProfileMenu();
  }

  function openPurchases() {
    alert('Opening Purchases and Memberships - Manage your subscriptions');
    toggleProfileMenu();
  }

  function openYourData() {
    alert('Opening Your Data in TikTik - Download or delete your data');
    toggleProfileMenu();
  }

  function openAppearance() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);

    // Update theme icon
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    alert(`Appearance changed to ${newTheme} theme`);
    toggleProfileMenu();
  }

  function openLanguage() {
    alert('Language Settings - Choose your preferred language');
    toggleProfileMenu();
  }

  function openRestrictedMode() {
    alert('Restricted Mode - Filter potentially mature content');
    toggleProfileMenu();
  }

  function openLocation() {
    alert('Location Settings - Set your country/region');
    toggleProfileMenu();
  }

  function openKeyboardShortcuts() {
    alert('Keyboard Shortcuts:\n\nSpace - Play/Pause\nArrow Left - Seek backward\nArrow Right - Seek forward\nM - Mute/Unmute\nF - Fullscreen\nT - Theater mode\nI - Miniplayer');
    toggleProfileMenu();
  }

  function openSettings() {
    // Navigate to settings page
    if (window.tiktikApp) {
      window.tiktikApp.navigateToPage('settings');
    }
    toggleProfileMenu();
  }

  function openHelp() {
    // Navigate to help page
    if (window.tiktikApp) {
      window.tiktikApp.navigateToPage('help');
    }
    toggleProfileMenu();
  }

  function sendFeedback() {
    // Navigate to feedback page
    if (window.tiktikApp) {
      window.tiktikApp.navigateToPage('feedback');
    }
    toggleProfileMenu();
  }

// Google Sign-in and Sign-out functionality
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;

      // UI Update
        document.getElementById("googleLoginBtn").style.display = "none";
        document.getElementById("profile-container").style.display = "flex";
        document.getElementById("profile-pic").src = user.photoURL;
        document.getElementById("profile-avatar").src = user.photoURL;
        document.getElementById("profile-name").innerText = user.displayName;
        document.getElementById("profile-email").innerText = user.email;

      console.log("Sign-in successful:", user);
    }).catch((error) => {
      console.error("Error signing in:", error);
    });
}

function signOut() {
  firebase.auth().signOut()
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful");

      // UI update
      document.getElementById("googleLoginBtn").style.display = "block";
      document.getElementById("profile-container").style.display = "none";
    }).catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
}

// Check if user is already signed-in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      document.getElementById("googleLoginBtn").style.display = "none";
      document.getElementById("profile-container").style.display = "flex";
      document.getElementById("profile-pic").src = user.photoURL;
      document.getElementById("profile-avatar").src = user.photoURL;
      document.getElementById("profile-name").innerText = user.displayName;
      document.getElementById("profile-email").innerText = user.email;
    }
});

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tiktikApp = new TikTikApp();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }
});
