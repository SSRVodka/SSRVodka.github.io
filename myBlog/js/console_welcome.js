function displayWelcomeMessage() {
  // 定义渐变颜色和样式
  const gradientStyle = `
    background: linear-gradient(
      90deg,
      #FF69B4, #9400D3, #1E90FF, #32CD32, #FFA500, #FF1493, #8A2BE2
    );
    -webkit-background-clip: text;
    background-clip: text;
    font-size: 14px;
    line-height: 1.6;
  `;

  const message = `
  🌸✨ Welcome to SSRVodka's blog! ✨🌸

  ｡･:*:･ﾟ★,｡･:*:･ﾟ☆ ｡･:*:･ﾟ★,｡･:*:･ﾟ☆

  We're happy you're here! 🐾
  Grab a cup of tea ☕ and enjoy your stay. 💖
  Remember, you're pawsome! 🐶🐱

  Have a magical day! 🌟
  ｡･:*:･ﾟ★,｡･:*:･ﾟ☆ ｡･:*:･ﾟ★,｡･:*:･ﾟ☆
  `;

  console.log(`%c${message}`, gradientStyle);
}

// 调用函数显示欢迎信息
displayWelcomeMessage();
