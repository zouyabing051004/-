# Theme Name: 梦幻治愈
# Vibe & Description: 低对比度、轻盈和柔焦质感、马卡龙色搭配、以圆角 / 柔边元素为主的风格，布局和过渡像云朵一样自然流动。

# Color
- 以马卡龙色为主，包含薄荷绿、天空蓝、棉花粉、珍珠紫等柔和色调，整体保持低对比度，营造宁静氛围，根据用户需求从中选择一种合适的主色，然后选择其他颜色作为辅助色、强调色等。

# Font
- Heading & Body: ResourceHanRoundedCN (url: https://resource-static.cdn.bcebos.com/fonts/ResourceHanRoundedCN-Regular.woff2)
# Animation
## 元素动画
- 点击按钮时，元素会像棉花糖一样轻微回弹或上浮，而不是生硬的变色；
- 关键元素带有轻微的上下浮动动画；
## 交互强调
## 入场
animate__slideInDown
## 过渡动画
- 使用慢速渐显，所有的过渡动画都适当放慢，引导用户放慢呼吸；
## 动画实现
- 项目中集成了 tailwindcss-intersect 插件，可以使用类似下述的方式来实现元素进入视口时的动画效果：
opacity-0 intersect:opacity-100 transition duration-700
- 同时可使用 motion/react 配合实现动画。

# Layout
- 行距、段距偏大，呈现柔和感
- 避免刻板的网格，采用自由散落的布局，如同云朵在天空中随意分布。

# Elements
- 圆角较大（16-24px），阴影非常柔和
- 使用不规则的圆角或CSS形变绘制形态。
- 按钮和卡片周围带有淡淡的发光效果，使用磨砂玻璃和柔焦背景，营造梦幻氛围。
- 元素之间轻微重叠，通过深度（z-index）而非边框来区分层级。
- （在需要的情况下）倾向于使用生图工具生成抽象柔和纹理的大面积首页背景；