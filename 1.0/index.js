/**
 * @fileoverview KISSY图片LightBox组件
 * @author Letao<mailzwj@126.com>
 * @module lightBox
 **/
KISSY.add(function (S, Node,Base) {
    var $ = Node.all, D = S.DOM, E = S.Event;
    /**
     * KISSY图片LightBox组件
     * @class LigntBox
     * @constructor
     * @extends Base
     */
    function LightBox(cfg) {
        var self = this;
        /**
         * 参数说明
         * @container 容器标识，表明在该容器中的eles会绑定lightbox
         * @eles 元素选择器，一般为class
         * @layer 浮层模版选择器
         * @prev 上一张触发器
         * @next 下一张触发器
         */
        this.container = S.one(cfg.container);
        this.eles = this.container.all(cfg.eles);
        this.layer = S.one(cfg.layer);
        this.prev = S.one(cfg.prev);
        this.next = S.one(cfg.next);
        this.isrun = null;
        this.init();

        //调用父类构造函数
        LightBox.superclass.constructor.call(self, cfg);
    }
    S.extend(LightBox, Base, /** @lends LigntBox.prototype*/{
        isShow: false,
        currentImg: null,
        log: function(err) { //无用的方法，测试时使用
            console.log(err);
        },
        getPos: function(node) {
            var pos = {};
            var xy = node.getBoundingClientRect();
            var st = D.scrollTop(window);
            var sl = D.scrollLeft(window);
            pos.x = xy.left + sl;
            pos.y = xy.top + st;
            return pos;
        },
        getCenter: function(node, cn) {
            var _this = this;
            D.css(D.get("#maskLayer"), "display", "none");
            var node_w = node.width,
                node_h = node.height,
                win_w = D.viewportWidth(),
                win_h = D.viewportHeight(),
                scr_top = D.scrollTop(window),
                scr_left = D.scrollLeft(window),
                default_w = node_w;
            node_w = (node_w > (win_w - 20)) ? (win_w - 20) : node_w;
            node_h = node_h * (node_w / default_w);
            var layer_left = scr_left + (win_w - node_w) / 2,
                layer_top = scr_top + (win_h - node_h) / 2;
            var lie = _this.getPos(cn),
                layer_width = D.width(cn),
                layer_height = D.height(cn);
            var layer_img = D.get("img", _this.layer);
            D.attr(layer_img, "src", "http://img02.taobaocdn.com/tps/i2/T1K7DnXfhXXXc6Yc2r-1-1.gif"); //一像素空白图片
            D.attr(layer_img, "width", node_w);
            D.attr(layer_img, "height", node_h);
            S.all(layer_img).fadeOut(0.3);
            layer_left = layer_left < 0 ? 0 : layer_left;
            layer_top = layer_top < 0 ? 0 : layer_top;
            if(!_this.isShow) {
                D.css(_this.layer, "left", lie.x + "px");
                D.css(_this.layer, "top", lie.y + "px");
                D.css(_this.layer, "width", layer_width + "px");
                D.css(_this.layer, "height", layer_height + "px");
                D.css(_this.layer, "display", "block");
                _this.isShow = true;
                if(_this.isrun && _this.isrun.isRunning()){
                    _this.isrun.stop();
                }
                _this.isrun = new S.Anim(_this.layer, {
                    "left": layer_left,
                    "top": layer_top,
                    "width": node_w,
                    "height": node_h,
                    "borderWidth": "10px"
                }, 0.3, "easeIn", function() {
                    D.attr(layer_img, "src", D.attr(node, "src"));
                    S.all(layer_img).fadeIn(0.3);
                });
                _this.isrun.run();
            } else {
                if(_this.isrun && _this.isrun.isRunning()){
                    _this.isrun.stop();
                }
                _this.isrun = new S.Anim(_this.layer, {
                    "left": layer_left,
                    "top": layer_top,
                    "width": node_w,
                    "height": node_h
                }, 0.3, "easeIn", function() {
                    D.attr(layer_img, "src", D.attr(node, "src"));
                    S.all(layer_img).fadeIn(0.3);
                });
                _this.isrun.run();
            }
        },
        doOnLoad: function(img, cn) {
            var _this = this;
            var node = new Image();
            if(S.UA.shell != "ie") {
                node.onload = function() {
                    if(node.complete == true) _this.getCenter(this, cn);
                }
            } else {
                node.onreadystatechange = function() {
                    if(node.readyState == "loaded" || node.readyState == "complete") {
                        _this.getCenter(this, cn);
                    }
                };
            }
            node.onerror = function() {
                //alert("图片加载失败！");
            }
            node.src = img;
        },
        showLoadMask: function() {
            var _this = this;
            var ml = D.get("#maskLayer"),
                left, top;
            if(ml) {
                left = (D.viewportWidth() - D.width(ml)) / 2 + D.scrollLeft(window);
                top = (D.viewportHeight() - D.height(ml)) / 2 + D.scrollTop(window);
                D.css(ml, "left", left + "px");
                D.css(ml, "top", top + "px");
                D.css(ml, "display", "block");
            } else {
                var mask = D.create("<div id='maskLayer' class='maskLayer'></div>");
                D.html(mask, "<img src='http://img02.taobaocdn.com/tps/i2/T115PmXipeXXaY1rfd-32-32.gif'>"); //Loading图标
                D.append(mask, D.get("body"));
                ml = D.get("#maskLayer");
                left = (D.viewportWidth() - D.width(ml)) / 2 + D.scrollLeft(window);
                top = (D.viewportHeight() - D.height(ml)) / 2 + D.scrollTop(window);
                D.css(ml, "left", left + "px");
                D.css(ml, "top", top + "px");
            }
        },
        doClick: function() {
            var _this = this;
            var cbtn = D.get(".closebtn", _this.layer);
            S.each(_this.eles, function(node) {
                E.on(node, "click", function() {
                    _this.currentImg = S.indexOf(this, _this.eles);
                    _this.showLoadMask();
                    _this.doOnLoad(D.attr(this, "href"), this);
                    return false;
                });
            });
            E.on(cbtn, "click", function() {
                var cpos = _this.getPos(_this.eles[_this.currentImg]);
                var cwidth = D.width(_this.eles[_this.currentImg]);
                var cheight = D.height(_this.eles[_this.currentImg]);
                D.attr(D.get("img", _this.layer), "src", "http://img02.taobaocdn.com/tps/i2/T1K7DnXfhXXXc6Yc2r-1-1.gif"); //一像素空白图片
                new S.Anim(_this.layer, {
                    "left": cpos.x,
                    "top": cpos.y,
                    "width": cwidth,
                    "height": cheight,
                    "borderWidth": 0
                }, 0.2, "easeOut", function() {
                    D.css(_this.layer, "display", "none");
                    _this.isShow = false;
                }).run();
            });

            E.on(_this.layer, "mouseover", function() {
                if(S.UA.ie <= 6) {
                    D.css(_this.prev, "height", D.height(_this.layer) + "px");
                    D.css(_this.prev, "width", D.width(_this.layer) * 0.3 + "px");
                    D.css(_this.next, "height", D.height(_this.layer) + "px");
                    D.css(_this.next, "width", D.width(_this.layer) * 0.3 + "px");
                }
                if(_this.currentImg != 0) {
                    D.css(_this.prev, "display", "block");
                }
                if(_this.currentImg != (_this.eles.length - 1)) {
                    D.css(_this.next, "display", "block");
                }
            });
            E.on(_this.layer, "mouseout", function() {
                D.css(_this.prev, "display", "none");
                D.css(_this.next, "display", "none");
            });
            E.on(_this.prev, "click", function() {
                _this.currentImg -= 1;
                _this.doOnLoad(D.attr(_this.eles[_this.currentImg], "href"), _this.eles[_this.currentImg]);
                if(_this.currentImg == 0) {
                    D.css(_this.prev, "display", "none");
                } else {
                    D.css(_this.prev, "display", "block");
                }
                D.css(_this.next, "display", "block");
            });
            E.on(_this.next, "click", function() {
                _this.currentImg += 1;
                _this.doOnLoad(D.attr(_this.eles[_this.currentImg], "href"), _this.eles[_this.currentImg]);
                if(_this.currentImg == (_this.eles.length - 1)) {
                    D.css(_this.next, "display", "none");
                } else {
                    D.css(_this.next, "display", "block");
                }
                D.css(_this.prev, "display", "block");
            });
            E.on(document, "keydown", function(e) {
                var key = e.keyCode;
                if(_this.isShow) {
                    if(key == 27) {
                        E.fire(cbtn, "click");
                    } else if(key == 37) {
                        if(_this.currentImg == 0) {
                            return;
                        }
                        D.css(D.get("#maskLayer"), "display", "block");
                        E.fire(_this.prev, "click");
                    } else if(key == 39) {
                        if(_this.currentImg == (_this.eles.length - 1)) {
                            return;
                        }
                        D.css(D.get("#maskLayer"), "display", "block");
                        E.fire(_this.next, "click");
                    }
                }
            });
            E.on(window, "resize", function() {
                if(_this.isShow){
                    if(_this.isrun && _this.isrun.isRunning()){
                        _this.isrun.stop();
                    }
                    _this.doOnLoad(D.attr(_this.eles[_this.currentImg], "href"), _this.eles[_this.currentImg]);
                }
            });
        },
        init: function() {
            this.doClick();
        }
    }, {ATTRS : /** @lends LigntBox*/{

    }});
    return LightBox;
}, {requires:['node', 'base']});



