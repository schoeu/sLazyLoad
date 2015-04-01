/**
 * Created by schoeu on 2014/3/31.
 * 兼容IE8+ 及其他浏览器
 * doc: http:
 */

void function(window,sLazyLoad){

    if(window.define && define.amd){
        define(sLazyLoad);
    }else{
        !window.sLazyLoad && (window.sLazyLoad = sLazyLoad(window,window.document));
    }

}(window,function(win,doc,undefined){

    function sLazyLoad(selector){
        return new F(selector);
    }

    function F(selector){
        this.init(selector);
    }

    F.prototype = {
        constructor : F,

        init:function(selector){
            var _ = this;
            _.eleScope = selector;
            _.allImg = doc.querySelectorAll(selector);
            _.imgArr = [];
            _.sign();
            _.timer = null;

            fixT.addEvent(win,"scroll",function(e){
                win.clearTimeout(_.timer);
                _.timer = null;
                _.timer = win.setTimeout(function(){
                    fixT._each(_.imgArr,function(ele){
                        if(fixT._hasClass(ele,"sLazy")){
                            if(ele.getBoundingClientRect().top - fixT.winH<100){
                                ele.src = ele.alt || "";
                                fixT._removeClass(ele,"sLazy");
                                fixT._addClass(ele,"sUnLazy");
                            }
                        }
                    });

                },100);
            });
        },

        //给操作的图片对象添加标识
        sign:function(){
            var _ = this;
            fixT._each(_.allImg,function(){
                fixT._addClass(this,"sLazy");
                _.imgArr.push(this);
            })

        }
    };

    var fixT = {
        //IE7+ document.body.clientHeight为文档高度，IE7+之前为窗口高度
        winH : (function(win,doc){
            if(window.innerHeight){
                return window.innerHeight;
            }else{
                return document.documentElement.clientHeight;
            }
        })(win,doc),

        //兼容老版IE
        addEvent:function(obj,type,fn){
            if(win.addEventListener){
                obj.addEventListener("scroll",fn,false);
            }else{
                obj.attachEvent("on"+type,fn);
            }
        },
        //遍历方法
        _each:function(obj,fn){
            for(var i= 0,l=obj.length;i<l;i++){
                fn.call(obj[i],obj[i],i)
            }
        },

        //class工具方法 为了兼容IE89,安卓2.3

        _addClass:(function(){
            var div = document.createElement("div");
            if(div.classList){
                return function(el,cls){
                    if(el){
                        el.classList.add(cls);
                    }
                }
            }else{
                return function(el,cls){
                    var className = el.className,
                        reg = new RegExp("\\b"+cls+"\\b","g");
                    if(!new RegExp(cls).test(className)){
                        el.className += " "+cls+" ";
                    }
                }
            }
        })(),

        _removeClass:(function(){
            var div = document.createElement("div");
            if(div.classList){
                return function(el,cls){
                    if(el) {
                        el.classList.remove(cls);
                    }
                }
            }else{
                return function(el,cls){
                    var className = el.className,
                        reg = new RegExp("\\b"+cls+"\\b","g");
                    if(reg.test(className)){
                        el.className = className.replace(reg,"");
                    }
                }
            }
        })(),

        _hasClass:(function(){
            var div = document.createElement("div");
            if(div.classList){
                return function(el,cls){
                    if(el) {
                        return el.classList.contains(cls);
                    }
                }
            }else{
                return function(el,cls){
                    var className = el.className,
                        reg = new RegExp("\\b"+cls+"\\b","g");
                    if(reg.test(className)){
                        return true;
                    }
                    return false;
                }
            }
        })()
    }

    return sLazyLoad;

});