# FatOtter.github.io 项目开发规则

## 项目概述
这是一个个人作品集网站项目，使用纯HTML、CSS和JavaScript构建，具有双语支持和响应式设计。

## 文件结构规范

### 目录组织
```
FatOtter.github.io/
├── index.html          # 主页面
├── css/                # 样式文件目录
│   ├── style.css       # 主样式文件
│   ├── story.css       # 故事页面样式
│   └── animate.css     # 动画样式
├── script/             # JavaScript文件目录
│   ├── script.js       # 主脚本文件
│   ├── story.js        # 故事页面脚本
│   └── *.min.js        # 第三方库文件
├── image/              # 图片资源目录
└── assets/             # 其他资源文件
```

### 文件命名规范
- HTML文件：使用小写字母，单词间用下划线分隔（如：`story_page.html`）
- CSS文件：使用小写字母，单词间用下划线分隔（如：`main_style.css`）
- JavaScript文件：使用小写字母，单词间用下划线分隔（如：`scroll_handler.js`）
- 图片文件：使用小写字母，描述性命名（如：`logo_white.png`）

## HTML 编码规范

### 基本结构
- 使用HTML5文档类型声明：`<!DOCTYPE html>`
- 设置正确的语言属性：`<html lang="en">`
- 包含必要的meta标签：charset、viewport等
- 使用语义化HTML标签

### 代码风格
- 使用4个空格缩进，不使用Tab
- 标签和属性名使用小写
- 属性值使用双引号包围
- 自闭合标签末尾添加空格和斜杠：`<img src="..." />`

### 示例
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
<body>
    <main>
        <header>
            <nav>
                <!-- 导航内容 -->
            </nav>
        </header>
    </main>
</body>
</html>
```

## CSS 编码规范

### 代码组织
- 使用通用重置样式在文件开头
- 按功能模块组织CSS规则
- 使用注释分隔不同功能区域

### 命名规范
- 类名使用小写字母，单词间用下划线分隔
- ID使用小写字母，单词间用下划线分隔
- 避免使用过于具体的选择器

### 代码风格
- 使用4个空格缩进
- 每个属性占一行
- 属性值后添加分号
- 颜色值使用小写
- 0值不添加单位

### 示例
```css
/* 基础重置 */
* {
    padding: 0;
    margin: 0;
}

/* 排版方案 */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Josefin Sans', sans-serif;
    color: white;
}

/* 背景块定义 */
.background_block {
    position: absolute;
    width: 100%;
    height: 100vh;
}
```

## JavaScript 编码规范

### 代码风格
- 使用4个空格缩进
- 使用驼峰命名法命名变量和函数
- 使用分号结束语句
- 字符串使用单引号或双引号保持一致

### 函数定义
- 函数名使用动词开头，描述性命名
- 参数名使用有意义的名称
- 添加必要的注释说明函数用途

### jQuery使用规范
- 使用`$(document).ready()`包装初始化代码
- 缓存jQuery对象避免重复查询
- 使用链式调用提高效率

### 示例
```javascript
function toggle_front(element) {
    var element_type = element.prop('tagName');
    var current_element = element;
    var current_index = element.parent().find(element_type).index(current_element);
    
    element.parent().find(element_type).each(function() {
        $(this).removeClass("front_layer base_layer before_front after_front");
        // 处理逻辑
    });
}

$(document).ready(function() {
    // 初始化代码
    $("body").removeClass("inverted");
    $(".animated").scrollClass();
});
```

## 响应式设计规范

### 断点设置
- 移动设备：320px - 768px
- 平板设备：768px - 1024px
- 桌面设备：1024px+

### 媒体查询
```css
/* 移动设备 */
@media (max-width: 768px) {
    /* 移动端样式 */
}

/* 平板设备 */
@media (min-width: 769px) and (max-width: 1024px) {
    /* 平板端样式 */
}
```

## 多语言支持规范

### HTML结构
- 使用`span`标签包装不同语言文本
- 使用类名区分语言：`.English`、`.Chinese`
- 使用`.no_display`类控制显示/隐藏

### 示例
```html
<h1>
    <span class="English">English Text</span>
    <span class="Chinese no_display">中文文本</span>
</h1>
```

### JavaScript控制
- 使用localStorage保存语言偏好
- 提供语言切换功能
- 动态切换显示状态

## 性能优化规范

### 图片优化
- 使用适当的图片格式（JPEG、PNG、WebP）
- 压缩图片文件大小
- 使用适当的图片尺寸

### 代码优化
- 压缩CSS和JavaScript文件
- 合并相关的CSS/JS文件
- 使用CDN加载第三方库

### 加载优化
- 使用`preconnect`预连接外部资源
- 延迟加载非关键资源
- 优化字体加载

## 浏览器兼容性

### 支持的浏览器
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 16+

### 兼容性处理
- 使用CSS前缀处理兼容性
- 提供JavaScript polyfill
- 测试主流浏览器

## 代码质量控制

### 代码审查
- 确保代码符合规范
- 检查功能完整性
- 验证响应式设计

### 测试要求
- 测试所有交互功能
- 验证多语言切换
- 检查不同设备显示效果

### 文档维护
- 更新相关文档
- 记录重要变更
- 维护代码注释

## 部署规范

### 文件检查
- 确保所有资源文件路径正确
- 检查外部链接有效性
- 验证图片资源完整性

### 版本控制
- 使用有意义的提交信息
- 定期创建版本标签
- 维护更新日志

## 安全规范

### 基本安全
- 避免内联JavaScript和CSS
- 使用HTTPS加载外部资源
- 验证用户输入（如有）

### 隐私保护
- 合理使用localStorage
- 避免收集不必要的用户信息
- 遵循数据保护法规