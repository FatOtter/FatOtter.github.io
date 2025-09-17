# 快速参考指南

## 文件命名
- HTML: `page_name.html`
- CSS: `style_name.css`
- JS: `script_name.js`
- 图片: `descriptive_name.ext`

## 代码风格速查

### HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
```

### CSS
```css
/* 4空格缩进，snake_case命名 */
.main_container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### JavaScript
```javascript
// 4空格缩进，camelCase命名
function toggleLanguage(element) {
    var currentLang = element.data('language');
    // 逻辑处理
}

$(document).ready(function() {
    // 初始化代码
});
```

## 多语言结构
```html
<span class="English">English Text</span>
<span class="Chinese no_display">中文文本</span>
```

## 响应式断点
- 移动端: `max-width: 768px`
- 平板: `769px - 1024px`
- 桌面: `min-width: 1025px`

## 常用类名
- `.no_display` - 隐藏元素
- `.animated` - 动画元素
- `.background_block` - 背景块
- `.layer_container` - 层容器

## 检查清单
- [ ] HTML语义化标签
- [ ] CSS响应式设计
- [ ] JavaScript功能测试
- [ ] 多语言切换正常
- [ ] 图片路径正确
- [ ] 外部链接有效