require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
})

module.exports = {
  title: `chiragpadyal.me`,
  description: `Developer blog by chirag padyal aka freakstar03`,
  language: `en`,
  siteUrl: `https://chiragpadyal.me`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `freakstar03/Freakstar_Blogs`, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: '0-ga', // Google Analytics Tracking ID
  author: {
    name: `Chirag Padyal`,
    bio: {
      role: `developer`,
      description: ['who like to write', 'who enjoys learning', 'interested in UI/UX', 'making something great'],
      thumbnail: 'sample.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/Freakstar03`, // `https://github.com/zoomKoding`,
      linkedIn: ``, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: `chirag.padyal@gmail.com`, // `zoomkoding@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        title: 'DevBootCamp - [Coursera Clone]',
        description:
          ' A single place for all development related courses.',
        techStack: ['tailwind', 'react', 'flask'],  
        thumbnailUrl: 'project-image.png',
        links: {
          post: '/gatsby-starter-zoomkoding-introduction',
          github: 'https://github.com/freakstar03/devbootcamp',
          demo: 'https://freakstar03.github.io/DevBootCamp/',
        },
      },
    ],
  },
};
