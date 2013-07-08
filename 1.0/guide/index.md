## 综述

## 快速使用

### 初始化组件

本地调试需添加以下配置

		S.Config.debug = true;
	    if (S.Config.debug) {
	        var srcPath = "../../../";
	        S.config({
	            packages:[
	                {
	                    name:"gallery",
	                    path:srcPath,
	                    charset:"utf-8",
	                    ignorePackageNameInUri:true
	                }
	            ]
	        });
	    }

初始化方法

	    S.use('gallery/lightBox/1.0/index,gallery/lightBox/1.0/index.css', function (S, LightBox) {
	        var lightBox = new LightBox({
	            container: "#container", //父级盒子ID
	            eles: ".J_lightbox", //需要弹出的图片外部链接样式
	            layer: "#lightbox", //弹出层ID
	            prev: "#lightbox .prevbtn", //上一张按钮
	            next: "#lightbox .nextbtn" //下一张按钮
	        });
	    })

## API说明

