export const buildStarterWidgets = ({ fullName, jobTitle, email }) => [
  {
    type: 'hero',
    order: 0,
    visible: true,
    data: {
      headline: fullName,
      subheadline: jobTitle,
      ctaText: 'Contact Me',
    },
  },
  {
    type: 'about',
    order: 1,
    visible: true,
    data: {
      avatarUrl: '',
      bio: `Hi, I'm ${fullName}. I'm a ${jobTitle} passionate about building great digital experiences. Welcome to my personal page!`,
    },
  },
  {
    type: 'skills',
    order: 2,
    visible: true,
    data: {
      items: [
        { name: 'JavaScript', level: 80 },
        { name: 'HTML & CSS', level: 85 },
        { name: 'Git', level: 70 },
      ],
    },
  },
  {
    type: 'projects',
    order: 3,
    visible: true,
    data: {
      items: [
        {
          title: 'Portfolio Website',
          description: 'My personal portfolio built with OnePage.',
          link: '#',
        },
        {
          title: 'Side Project',
          description: 'A project I am currently working on.',
          link: '#',
        },
      ],
    },
  },
  {
    type: 'social',
    order: 4,
    visible: true,
    data: {
      github: '',
      linkedin: '',
      twitter: '',
    },
  },
  {
    type: 'contact',
    order: 5,
    visible: true,
    data: {
      email: email || 'hello@example.com',
      placeholder: 'Send me a message...',
    },
  },
];
