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
        
        // Video data with actual video URLs
        this.videos = [
            {
                id: '1',
                title: 'Amazing Sunset Timelapse - Nature\'s Beauty Unveiled',
                channel: 'NatureFilms HD',
                avatar: 'https://pixabay.com/get/gec6e54e2919e4a5d18cbc00c133c485a19179de6a46f131b31ed3cd94c8c8a054fe25ed78a96a3265f0c8cef7e38522c2e91cb914d63f37190e1a3e4013241b7_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g2d6e4de48b7bd3a87afab6e869007196adcc1cb3dfd663e6e585bcffd24c3260ab24ba71895df36ec3dc5902cba221c21d6918c76ffa1876e8ac616c437334eb_1280.jpg',
                duration: '5:24',
                views: '1.2M views',
                uploadTime: '2 days ago',
                likes: 15420,
                description: 'Watch this breathtaking sunset timelapse captured over the mountains. The golden hour creates magical lighting that transforms the landscape into a work of art.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                category: 'nature'
            },
            {
                id: '2',
                title: 'City Lights at Night - Urban Photography Tips',
                channel: 'PhotoMaster Pro',
                avatar: 'https://pixabay.com/get/g2f3bd00b498776f7c22fbbcc5c126c6ef40fae301a35014cc2bf1f104b6789ca01d1994ee29184c9c5651352319b9e57f42f6ce3a16f2aa0a2599c3ef2795080_1280.jpg',
                thumbnail: 'https://pixabay.com/get/gc46bcb53f99cc1a7dcbfe0fa97f1f89ea4a3aff78acd4cbed36941cc76b8a77bab91b0c5bd33468245fb7c7e08d3ecfee29059dd5fbcb79169641f2c7908f7d0_1280.jpg',
                duration: '8:15',
                views: '890K views',
                uploadTime: '5 days ago',
                likes: 12350,
                description: 'Learn professional techniques for capturing stunning city lights at night. This tutorial covers camera settings, composition, and post-processing tips.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                category: 'learning'
            },
            {
                id: '3',
                title: 'Mountain Adventure - Hiking the Great Peaks',
                channel: 'Adventure Seekers',
                avatar: 'https://pixabay.com/get/g727b5c506ff678b49c5ad56b7dfbd90d2a044c1fd61d5f1c48760fe86afba1adeede5ac345ed4fd79d591e3e3dcc1a5f1245930860f8237be2afebaef8e9aebb_1280.jpg',
                thumbnail: 'https://pixabay.com/get/gee140c21f57d0e059681c522073cee7f9cf8701bbb9bea45096b81f3c429490f5dadd27f6fb88d06918a0f35c0084c2b155f80b3cf9c1e582e85e5e6f3de9f9b_1280.jpg',
                duration: '12:45',
                views: '2.1M views',
                uploadTime: '1 week ago',
                likes: 28970,
                description: 'Join us on an epic mountain hiking adventure through breathtaking landscapes. Experience the thrill of reaching new heights and discovering hidden gems.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                category: 'sports'
            },
            {
                id: '4',
                title: 'Abstract Art Visualization - Digital Creativity',
                channel: 'Digital Art Studio',
                avatar: 'https://pixabay.com/get/gdd1eb5dec247f02af89031bab0d27a4d5fcf0937eee4294516fe3e27032217410dfacbe5524a30c83ed092ae88e95ecf68db30fd11dd5a10fdbfa19653a5978b_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g7ad68ce073f5c33ffa357c0b8ffb8d9e9ce7420f8ece89515052e9be1c42e34244938815b59859e67d28e9aa34beac25392340cd990b1a1b8c89e046d30795ba_1280.jpg',
                duration: '6:30',
                views: '456K views',
                uploadTime: '1 day ago',
                likes: 8920,
                description: 'Explore the world of abstract digital art through stunning visualizations and creative techniques. Perfect for artists and design enthusiasts.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                category: 'learning'
            },
            {
                id: '5',
                title: 'Ocean Waves - Relaxing Nature Sounds',
                channel: 'Peaceful Moments',
                avatar: 'https://pixabay.com/get/g0a5da4b16791ee5a080efc068a5a97b5eadc1194838f0aa8ab7aff8602beb52959adb3e71c6324a009335d29593d2178b3ebe319247e071e50815ab190d7664e_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g2c736471db05f3161ea3fd9781a42a96e9e79523db07155ec05a77a92896f367d73cd460275cba8f1581583d76dfc2f5bbc3a9d453c7ec76d297a0114349da02_1280.jpg',
                duration: '30:00',
                views: '3.5M views',
                uploadTime: '3 days ago',
                likes: 45120,
                description: 'Immerse yourself in the calming sounds of ocean waves. Perfect for relaxation, meditation, or as background ambiance for work and study.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                category: 'music'
            },
            {
                id: '6',
                title: 'Vintage Photography Techniques',
                channel: 'RetroShot Academy',
                avatar: 'https://pixabay.com/get/g1882a617f55023cde87198feea9e830686b0a69ae7f315295cebe2b111a575a3d2dd94672359c9d34b332edd722a8e7d502b680acae2e35040353fd2a2ee0f9a_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g2acd87b5606abd12fdd940fedc6ad1465e1b382e21d29a82469fbbc6b7373aca65c1b20d18b76260f3f253f051ded88bfd2160370491c74bb4f28d5c85618ab3_1280.jpg',
                duration: '9:42',
                views: '678K views',
                uploadTime: '4 days ago',
                likes: 11230,
                description: 'Discover the art of vintage photography with classic techniques and modern applications. Learn to create timeless images with nostalgic appeal.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
                category: 'learning'
            },
            {
                id: '7',
                title: 'Urban Street Art Documentary',
                channel: 'Street Culture',
                avatar: 'https://pixabay.com/get/gec6e54e2919e4a5d18cbc00c133c485a19179de6a46f131b31ed3cd94c8c8a054fe25ed78a96a3265f0c8cef7e38522c2e91cb914d63f37190e1a3e4013241b7_1280.jpg',
                thumbnail: 'https://pixabay.com/get/gdabda4175df3ffc8fa97883037c1257c71ff3538d88730bdade5be4b780d7dcd74a09d5b6ae17f60f165982744f852efc36cb5a28ef5fb365f8410f675cad28e_1280.jpg',
                duration: '15:30',
                views: '1.8M views',
                uploadTime: '6 days ago',
                likes: 22140,
                description: 'Explore the vibrant world of urban street art through the eyes of talented artists. A journey through creativity, culture, and self-expression.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                category: 'news'
            },
            {
                id: '8',
                title: 'Minimalist Design Principles',
                channel: 'Design Theory',
                avatar: 'https://pixabay.com/get/g2f3bd00b498776f7c22fbbcc5c126c6ef40fae301a35014cc2bf1f104b6789ca01d1994ee29184c9c5651352319b9e57f42f6ce3a16f2aa0a2599c3ef2795080_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g6a3bfd52a3bb24e45cec35fa0a66864b648b3ada7508b940d145fdb9f142eabf5b71ecac54b3226b9453e1b509d41f39568098161aaf7164554e4140fafe5a7a_1280.jpg',
                duration: '7:18',
                views: '534K views',
                uploadTime: '2 days ago',
                likes: 9870,
                description: 'Master the art of minimalist design with these fundamental principles. Learn how less can truly be more in creating impactful visual experiences.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
                category: 'learning'
            },
            {
                id: '9',
                title: 'Epic Gaming Montage - Best Moments 2024',
                channel: 'GameMaster Pro',
                avatar: 'https://pixabay.com/get/g727b5c506ff678b49c5ad56b7dfbd90d2a044c1fd61d5f1c48760fe86afba1adeede5ac345ed4fd79d591e3e3dcc1a5f1245930860f8237be2afebaef8e9aebb_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g6a3bfd52a3bb24e45cec35fa0a66864b648b3ada7508b940d145fdb9f142eabf5b71ecac54b3226b9453e1b509d41f39568098161aaf7164554e4140fafe5a7a_1280.jpg',
                duration: '10:35',
                views: '1.5M views',
                uploadTime: '1 day ago',
                likes: 35420,
                description: 'The best gaming moments from 2024! Epic wins, amazing plays, and unforgettable gaming experiences.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                category: 'gaming'
            },
            {
                id: '10',
                title: 'Breaking News: Tech Innovation Summit',
                channel: 'TechNews Daily',
                avatar: 'https://pixabay.com/get/gec6e54e2919e4a5d18cbc00c133c485a19179de6a46f131b31ed3cd94c8c8a054fe25ed78a96a3265f0c8cef7e38522c2e91cb914d63f37190e1a3e4013241b7_1280.jpg',
                thumbnail: 'https://pixabay.com/get/gdabda4175df3ffc8fa97883037c1257c71ff3538d88730bdade5be4b780d7dcd74a09d5b6ae17f60f165982744f852efc36cb5a28ef5fb365f8410f675cad28e_1280.jpg',
                duration: '8:22',
                views: '890K views',
                uploadTime: '3 hours ago',
                likes: 12890,
                description: 'Live coverage of the annual Tech Innovation Summit featuring the latest breakthroughs in technology.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
                category: 'news'
            },
            {
                id: '11',
                title: 'Relaxing Piano Music - Study & Sleep',
                channel: 'Peaceful Sounds',
                avatar: 'https://pixabay.com/get/g0a5da4b16791ee5a080efc068a5a97b5eadc1194838f0aa8ab7aff8602beb52959adb3e71c6324a009335d29593d2178b3ebe319247e071e50815ab190d7664e_1280.jpg',
                thumbnail: 'https://pixabay.com/get/g2c736471db05f3161ea3fd9781a42a96e9e79523db07155ec05a77a92896f367d73cd460275cba8f1581583d76dfc2f5bbc3a9d453c7ec76d297a0114349da02_1280.jpg',
                duration: '60:00',
                views: '2.8M views',
                uploadTime: '1 week ago',
                likes: 78540,
                description: 'Beautiful piano music perfect for studying, sleeping, or relaxation. 1 hour of peaceful melodies.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                category: 'music'
            },
            {
                id: '12',
                title: 'Football Highlights - World Cup 2024',
                channel: 'Sports Central',
                avatar: 'https://pixabay.com/get/g727b5c506ff678b49c5ad56b7dfbd90d2a044c1fd61d5f1c48760fe86afba1adeede5ac345ed4fd79d591e3e3dcc1a5f1245930860f8237be2afebaef8e9aebb_1280.jpg',
                thumbnail: 'https://pixabay.com/get/gee140c21f57d0e059681c522073cee7f9cf8701bbb9bea45096b81f3c429490f5dadd27f6fb88d06918a0f35c0084c2b155f80b3cf9c1e582e85e5e6f3de9f9b_1280.jpg',
                duration: '15:48',
                views: '4.2M views',
                uploadTime: '2 days ago',
                likes: 89750,
                description: 'Best moments from World Cup 2024 matches. Goals, saves, and incredible plays from the tournament.',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                category: 'sports'
            }
        ];

        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.loadHomePage();
        this.setupSearch();
    }

    setupEventListeners() {
        // Menu toggle
        document.getElementById('menuBtn').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Admin panel
        document.getElementById('adminPanelBtn').addEventListener('click', () => {
            this.openAdminPanel();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Video modal controls
        document.getElementById('closeVideoBtn').addEventListener('click', () => {
            this.closeVideoModal();
        });

        // Admin modal controls
        document.getElementById('closeAdminBtn').addEventListener('click', () => {
            this.closeAdminPanel();
        });

        // Admin settings
        this.setupAdminControls();

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

    setupSearch() {
        // Mock search functionality
        this.searchResults = [];
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    toggleTheme() {
        const currentTheme = this.settings.theme;
        this.settings.theme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.saveSettings();
    }

    applyTheme() {
        const theme = this.settings.theme === 'auto' ? this.detectSystemTheme() : this.settings.theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    detectSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`${page}Page`).classList.add('active');

        this.currentPage = page;

        // Load page content
        switch (page) {
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
            case 'watchlater':
                this.loadWatchLaterPage();
                break;
            case 'downloads':
                this.loadDownloadsPage();
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

    loadHomePage() {
        const grid = document.getElementById('videoGrid');
        grid.innerHTML = '';
        
        const videosToShow = this.videos.slice(0, this.settings.videosPerPage);
        videosToShow.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadTrendingPage() {
        const grid = document.getElementById('trendingGrid');
        grid.innerHTML = '';
        
        // Sort by views (mock trending algorithm)
        const trendingVideos = [...this.videos].sort((a, b) => {
            const aViews = parseFloat(a.views.replace(/[^\d.]/g, ''));
            const bViews = parseFloat(b.views.replace(/[^\d.]/g, ''));
            return bViews - aViews;
        });

        trendingVideos.forEach(video => {
            const videoCard = this.createVideoCard(video);
            grid.appendChild(videoCard);
        });
    }

    loadSubscriptionsPage() {
        // Show empty state for now
    }

    loadLibraryPage() {
        // Show empty state for now
    }

    loadHistoryPage() {
        const page = document.getElementById('historyPage');
        if (this.watchHistory.length === 0) {
            return; // Keep empty state
        }

        // Create history grid
        page.innerHTML = '<h2>Watch History</h2><div class="video-grid" id="historyGrid"></div>';
        const grid = document.getElementById('historyGrid');
        
        this.watchHistory.reverse().forEach(videoId => {
            const video = this.videos.find(v => v.id === videoId);
            if (video) {
                const videoCard = this.createVideoCard(video);
                grid.appendChild(videoCard);
            }
        });
    }

    loadLikedPage() {
        const page = document.getElementById('likedPage');
        if (this.likedVideos.length === 0) {
            return; // Keep empty state
        }

        // Create liked videos grid
        page.innerHTML = '<h2>Liked Videos</h2><div class="video-grid" id="likedGrid"></div>';
        const grid = document.getElementById('likedGrid');
        
        this.likedVideos.forEach(videoId => {
            const video = this.videos.find(v => v.id === videoId);
            if (video) {
                const videoCard = this.createVideoCard(video);
                grid.appendChild(videoCard);
            }
        });
    }

    loadWatchLaterPage() {
        // Show empty state for now
    }

    loadDownloadsPage() {
        // Show empty state for now
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
        
        // Update modal content
        document.getElementById('modalVideoTitle').textContent = video.title;
        document.getElementById('modalChannelAvatar').src = video.avatar;
        document.getElementById('modalChannelName').textContent = video.channel;
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
            saveBtn.classList.add('active');
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
        } else {
            saveBtn.classList.remove('active');
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
        }
        
        // Load recommended videos
        this.loadRecommendedVideos(video);
        
        // Load comments
        this.loadVideoComments(video.id);
        
        // Set video source and load
        const player = document.getElementById('videoPlayer');
        if (video.videoUrl) {
            player.src = video.videoUrl;
            player.load();
        }
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add to history
        this.addToHistory(video);
    }

    closeVideoModal() {
        const modal = document.getElementById('videoModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Pause video
        const player = document.getElementById('videoPlayer');
        player.pause();
        player.currentTime = 0;
        
        this.currentVideo = null;
    }

    loadRecommendedVideos(currentVideo) {
        const container = document.getElementById('recommendedList');
        container.innerHTML = '';
        
        // Get other videos (excluding current)
        const recommended = this.videos.filter(v => v.id !== currentVideo.id).slice(0, 5);
        
        recommended.forEach(video => {
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
            
            container.appendChild(item);
        });
    }

    toggleLike() {
        if (!this.currentVideo) return;
        
        const likeBtn = document.getElementById('likeBtn');
        const isLiked = this.likedVideos.includes(this.currentVideo.id);
        
        if (isLiked) {
            // Remove like
            this.likedVideos = this.likedVideos.filter(id => id !== this.currentVideo.id);
            likeBtn.classList.remove('active');
            this.currentVideo.likes--;
        } else {
            // Add like
            this.likedVideos.push(this.currentVideo.id);
            likeBtn.classList.add('active');
            this.currentVideo.likes++;
        }
        
        document.getElementById('likeCount').textContent = this.formatNumber(this.currentVideo.likes);
        this.saveLikedVideos();
        
        this.showToast(isLiked ? 'Removed from liked videos' : 'Added to liked videos', 'success');
    }

    toggleDislike() {
        // Simple dislike functionality (just visual feedback)
        const dislikeBtn = document.getElementById('dislikeBtn');
        dislikeBtn.classList.toggle('active');
        
        this.showToast('Thanks for your feedback', 'success');
    }

    performSearch() {
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        
        if (!query) {
            this.showToast('Please enter a search term', 'warning');
            return;
        }
        
        // Mock search - filter videos by title or channel
        this.searchResults = this.videos.filter(video => 
            video.title.toLowerCase().includes(query) ||
            video.channel.toLowerCase().includes(query)
        );
        
        // Update home page with search results
        const grid = document.getElementById('videoGrid');
        grid.innerHTML = '';
        
        if (this.searchResults.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <p>No results found</p>
                    <span>Try different keywords or check your spelling</span>
                </div>
            `;
        } else {
            this.searchResults.forEach(video => {
                const videoCard = this.createVideoCard(video);
                grid.appendChild(videoCard);
            });
        }
        
        // Navigate to home page to show results
        this.navigateToPage('home');
        
        this.showToast(`Found ${this.searchResults.length} result(s)`, 'success');
    }

    openAdminPanel() {
        const modal = document.getElementById('adminModal');
        
        // Update form values
        document.querySelector(`input[name="theme"][value="${this.settings.theme}"]`).checked = true;
        document.getElementById('autoPlay').checked = this.settings.autoPlay;
        document.getElementById('showDescriptions').checked = this.settings.showDescriptions;
        document.getElementById('videosPerPage').value = this.settings.videosPerPage;
        
        modal.classList.add('active');
    }

    closeAdminPanel() {
        const modal = document.getElementById('adminModal');
        modal.classList.remove('active');
    }

    addToHistory(video) {
        // Remove if already exists, then add to beginning
        this.watchHistory = this.watchHistory.filter(id => id !== video.id);
        this.watchHistory.unshift(video.id);
        
        // Keep only last 50 videos
        if (this.watchHistory.length > 50) {
            this.watchHistory = this.watchHistory.slice(0, 50);
        }
        
        this.saveWatchHistory();
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear your watch history?')) {
            this.watchHistory = [];
            this.saveWatchHistory();
            this.showToast('Watch history cleared', 'success');
            
            // Refresh history page if currently viewing
            if (this.currentPage === 'history') {
                this.loadHistoryPage();
            }
        }
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            this.settings = this.getDefaultSettings();
            this.applyTheme();
            this.saveSettings();
            
            // Update admin panel form
            document.querySelector(`input[name="theme"][value="${this.settings.theme}"]`).checked = true;
            document.getElementById('autoPlay').checked = this.settings.autoPlay;
            document.getElementById('showDescriptions').checked = this.settings.showDescriptions;
            document.getElementById('videosPerPage').value = this.settings.videosPerPage;
            
            this.showToast('Settings reset to default', 'success');
        }
    }

    saveSettings() {
        localStorage.setItem('tiktik_settings', JSON.stringify(this.settings));
        this.closeAdminPanel();
        this.showToast('Settings saved successfully', 'success');
    }

    loadSettings() {
        const saved = localStorage.getItem('tiktik_settings');
        return saved ? JSON.parse(saved) : this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
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

    loadSavedVideos() {
        const saved = localStorage.getItem('tiktik_saved_videos');
        return saved ? JSON.parse(saved) : [];
    }

    saveSavedVideos() {
        localStorage.setItem('tiktik_saved_videos', JSON.stringify(this.savedVideos));
    }

    loadComments() {
        const saved = localStorage.getItem('tiktik_comments');
        return saved ? JSON.parse(saved) : this.getDefaultComments();
    }

    saveComments() {
        localStorage.setItem('tiktik_comments', JSON.stringify(this.comments));
    }

    getDefaultComments() {
        return {
            '1': [
                {
                    id: 'c1',
                    author: 'NatureLover123',
                    avatar: 'https://pixabay.com/get/g727b5c506ff678b49c5ad56b7dfbd90d2a044c1fd61d5f1c48760fe86afba1adeede5ac345ed4fd79d591e3e3dcc1a5f1245930860f8237be2afebaef8e9aebb_1280.jpg',
                    text: 'Absolutely stunning! The colors in this sunset are incredible.',
                    time: '2 hours ago',
                    likes: 24
                },
                {
                    id: 'c2',
                    author: 'PhotoPro2024',
                    avatar: 'https://pixabay.com/get/g2f3bd00b498776f7c22fbbcc5c126c6ef40fae301a35014cc2bf1f104b6789ca01d1994ee29184c9c5651352319b9e57f42f6ce3a16f2aa0a2599c3ef2795080_1280.jpg',
                    text: 'What camera settings did you use for this? The detail is amazing!',
                    time: '4 hours ago',
                    likes: 12
                }
            ],
            '2': [
                {
                    id: 'c4',
                    author: 'CityPhotographer',
                    avatar: 'https://pixabay.com/get/g0a5da4b16791ee5a080efc068a5a97b5eadc1194838f0aa8ab7aff8602beb52959adb3e71c6324a009335d29593d2178b3ebe319247e071e50815ab190d7664e_1280.jpg',
                    text: 'Great tutorial! Finally learned how to capture city lights properly.',
                    time: '1 hour ago',
                    likes: 18
                }
            ]
        };
    }

    shareVideo() {
        if (this.currentVideo) {
            if (navigator.share) {
                navigator.share({
                    title: this.currentVideo.title,
                    text: `Check out this video: ${this.currentVideo.title}`,
                    url: window.location.href
                }).catch(err => {
                    this.fallbackShare();
                });
            } else {
                this.fallbackShare();
            }
        }
    }

    fallbackShare() {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showToast('Link copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Could not copy link', 'error');
        });
    }

    toggleSave() {
        if (!this.currentVideo) return;

        const videoId = this.currentVideo.id;
        const saveBtn = document.getElementById('saveBtn');

        if (this.savedVideos.includes(videoId)) {
            this.savedVideos = this.savedVideos.filter(id => id !== videoId);
            saveBtn.classList.remove('active');
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Save';
            this.showToast('Removed from saved videos', 'info');
        } else {
            this.savedVideos.push(videoId);
            saveBtn.classList.add('active');
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
            this.showToast('Added to saved videos', 'success');
        }

        this.saveSavedVideos();
    }

    downloadVideo() {
        if (this.currentVideo && this.currentVideo.videoUrl) {
            const link = document.createElement('a');
            link.href = this.currentVideo.videoUrl;
            link.download = `${this.currentVideo.title}.mp4`;
            link.click();
            this.showToast('Download started!', 'success');
        } else {
            this.showToast('Video not available for download', 'error');
        }
    }

    showCommentActions() {
        document.querySelector('.comment-actions').style.display = 'flex';
    }

    hideCommentActions() {
        document.querySelector('.comment-actions').style.display = 'none';
        document.getElementById('commentInput').value = '';
        document.getElementById('commentInput').blur();
    }

    submitComment() {
        const input = document.getElementById('commentInput');
        const text = input.value.trim();

        if (text && this.currentVideo) {
            const newComment = {
                id: 'c' + Date.now(),
                author: 'You',
                avatar: 'https://pixabay.com/get/g1882a617f55023cde87198feea9e830686b0a69ae7f315295cebe2b111a575a3d2dd94672359c9d34b332edd722a8e7d502b680acae2e35040353fd2a2ee0f9a_1280.jpg',
                text: text,
                time: 'just now',
                likes: 0
            };

            if (!this.comments[this.currentVideo.id]) {
                this.comments[this.currentVideo.id] = [];
            }

            this.comments[this.currentVideo.id].unshift(newComment);
            this.saveComments();
            this.loadVideoComments(this.currentVideo.id);
            this.hideCommentActions();
            this.showToast('Comment added!', 'success');
        }
    }

    loadVideoComments(videoId) {
        const commentsList = document.getElementById('commentsList');
        const commentCount = document.getElementById('commentCount');
        
        const videoComments = this.comments[videoId] || [];
        commentCount.textContent = videoComments.length;

        commentsList.innerHTML = '';

        videoComments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            
            commentItem.innerHTML = `
                <img class="user-avatar-small" src="${comment.avatar}" alt="${comment.author}">
                <div class="comment-content">
                    <div class="comment-author">
                        ${comment.author}
                        <span class="comment-time">${comment.time}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-actions-bar">
                        <button class="comment-like-btn" onclick="window.tiktikApp.likeComment('${comment.id}', '${videoId}')">
                            <i class="fas fa-thumbs-up"></i>
                            <span>${comment.likes}</span>
                        </button>
                        <button class="comment-reply-btn">Reply</button>
                    </div>
                </div>
            `;

            commentsList.appendChild(commentItem);
        });
    }

    likeComment(commentId, videoId) {
        const videoComments = this.comments[videoId];
        if (videoComments) {
            const comment = videoComments.find(c => c.id === commentId);
            if (comment) {
                comment.likes += 1;
                this.saveComments();
                this.loadVideoComments(videoId);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tiktikApp = new TikTikApp();
});

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (window.tiktikApp && window.tiktikApp.settings.theme === 'auto') {
        window.tiktikApp.applyTheme();
    }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        // Mobile behavior
        const sidebar = document.getElementById('sidebar');
        if (!sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('active');
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        const videoModal = document.getElementById('videoModal');
        const adminModal = document.getElementById('adminModal');
        
        if (videoModal.classList.contains('active')) {
            window.tiktikApp.closeVideoModal();
        } else if (adminModal.classList.contains('active')) {
            window.tiktikApp.closeAdminPanel();
        }
    }
    
    // Space to play/pause video (when modal is open)
    if (e.key === ' ' && document.getElementById('videoModal').classList.contains('active')) {
        e.preventDefault();
        const player = document.getElementById('videoPlayer');
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }
});
