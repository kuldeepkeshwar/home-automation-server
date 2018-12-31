/* eslint-disable func-names */
import React from 'react';

const EmojiStyle = {
  fontSize: '2rem',
  height: '2rem',
  width: '2rem',
};
function BaseEmojiImage(name, src) {
  return function ({ style = {} }) {
    return <img style={{ ...EmojiStyle, ...style }} alt={name} src={src} />;
  };
}
function BaseEmoji(name, emoji) {
  return function ({ style = {} }) {
    return (
      <span style={{ ...EmojiStyle, ...style }} role="img" aria-label={name}>
        {emoji}
      </span>
    );
  };
}
const EMOJIS = {
  online: BaseEmojiImage(
    'online',
    'https://img.icons8.com/color/48/000000/online.png',
  ),
  offline: BaseEmojiImage(
    'offline',
    'https://img.icons8.com/color/48/000000/offline.png',
  ),
  ip: BaseEmojiImage(
    'ip',
    'https://img.icons8.com/color/48/000000/ip-address.png',
  ),
  'iot-board': BaseEmojiImage(
    'iot-board',
    'https://img.icons8.com/color/48/000000/smartphone-ram.png',
  ),
  'home-automation': BaseEmojiImage(
    'home-automation',
    'https://img.icons8.com/ultraviolet/48/000000/home-automation.png',
  ),
  'home theatre': BaseEmojiImage(
    'home theatre',
    'https://img.icons8.com/ultraviolet/48/000000/subwoofer.png',
  ),
  watch: BaseEmojiImage(
    'watch',
    'https://img.icons8.com/color/48/000000/watch.png',
  ),
  fan: BaseEmojiImage('fan', 'https://img.icons8.com/color/48/000000/fan.png'),
  tv: BaseEmoji('tv', '📺'),
  light: BaseEmoji('light', '💡'),
  plug: BaseEmoji('plug', '🔌'),
};
export default function Emoji({ name, style }) {
  const Component = EMOJIS[name];
  return Component ? <Component style={style} /> : name;
}
