
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
        
        // Video data with actual video URLs
        this.videos = [
            {
                id: '1',
                title: 'Amazing Sunset Timelapse - Nature\'s Beauty Unveiled',
                channel: 'NatureFilms HD',
                avatar: 'https://pixabay.com/get/gf2d38d42d8a2c7e0ac06e52b7db59b5aa5b5e7b8b1ff7d6b4b8c1c37e1c3c0c5_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g4c1a5c5b5c1b5c5b5c1b5c5b5c1b5c5b5c1b5c5b5c1b5c5b5c1b5c5b5c1b5c5_1280.jpg',
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
                avatar: 'https://pixabay.com/get/g1882a617f55023cde87198feea9e830686b0a69ae7f315295cebe2b111a575a3d2dd94672359c9d34b332edd722a8e7d502b680acae2e35040353fd2a2ee0f9a_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g2d6e4de48b7bd3a87afab6e869007196adcc1cb3dfd663e6e585bcffd24c3260ab24ba71895df36ec3dc5902cba221c21d6918c76ffa1876e8ac616c437334eb_1280.jpg',
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
                avatar: 'https://pixabay.com/get/g0a5da4b16791ee5a080efc068a5a97b5eadc1194838f0aa8ab7aff8602beb52959adb3e71c6324a009335d29593d2178b3ebe319247e071e50815ab190d7664e_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g3c1a2b32f52b3c5a3c1b2c3d4e5f6789abcdef123456789abcdef123456789abc_1280.jpg',
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
                avatar: 'https://pixabay.com/get/g2c736471db05f3161ea3fd9781a42a96e9e79523db07155ec05a77a92896f367d73cd460275cba8f1581583d76dfc2f5bbc3a9d453c7ec76d297a0114349da02_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g4d5e6f789abcdef123456789abcdef123456789abcdef123456789abcdef123_1280.jpg',
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
                avatar: 'https://pixabay.com/get/g5e6f789abcdef123456789abcdef123456789abcdef123456789abcdef123456_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g6f789abcdef123456789abcdef123456789abcdef123456789abcdef123456789_1280.jpg',
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
        // Settings page content is already in HTML
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
                <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                <span class="video-duration">${video.duration}</span>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <div class="channel-info">
                    <img class="channel-avatar" src="${video.avatar}" alt="${video.channel}">
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
        
        modal.classList.remove('active');
        player.pause();
        player.src = '';
        
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tiktikApp = new TikTikApp();
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully');
            })
            .catch((error) => {
                console.log('Service Worker registration failed');
            });
    }
});
