
const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.volume = 0.4;
  audio.play().catch(() => {}); // Ignore autoplay blocks
};

export const sounds = {
  hover: () => playSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
  click: () => playSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'),
  correct: () => playSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'),
  wrong: () => playSound('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3'),
  success: () => playSound('https://assets.mixkit.co/active_storage/sfx/1433/1433-preview.mp3'),
};
