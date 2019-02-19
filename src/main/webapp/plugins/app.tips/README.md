# 提示弹窗 app.tips

## 描述

提示弹框的简单封装。

## 使用

```javascript
app.tips(title,msg,type);

/**
 * 例如
*/
//成功提示
app.tips('成功提示','添加xxx成功！',app.tips.SUCCESS);

//错误提示
app.tips('错误提示','发送异常：xxxx',app.tips.ERROR);

//警告提示
app.tips('警告提示','语法错误！',app.tips.WARNING);

//默认提示
app.tips('提示','提示内容。',app.tips._DEFAULT);
//或者
app.tips('提示','提示内容。',app.tips.INFO);

```

<!--日志 Start-->

## 更新日志

V6.0.0
- 新增功能。

<!--日志 End-->