/**
 * @class Be
 * @param window [type object]
 * @param document [type object]
 * @return object
 */
var Be = (function (window, document) {
    /**
     * @namespace tools
     * @description 工具函数
     */
    var tools = {
        /**
         * @method bindEvent
         * @description 事件绑定
         */
        bindEvent: function(el, type, fn) {
            el.addEventListener ? el.addEventListener(type, fn, false) : el.attachEvent('on' + type, function (event) {
                fn.call(el, event)
            })
        },
        /**
         * @method addEvent
         * @description 添加事件
         */
        addEvent: function(el, type, fn) {
            if(el && el.nodeName || el === window) {
                tools.bindEvent(el, type, fn);
            } else if(el.length) {
                for(var p in el) {
                    if (!el.hasOwnProperty(p)) { continue; }
                    tools.bindEvent(el[p], type, fn);
                }
            }
        },
        /**
         * @method $
         * @description 简易标签选这器
         */
        $: function(str) {
            if(typeof str === 'object' && str.length) {
                return str;
            } else if(/^\#.+/.test(str)) {
                return document.getElementById(str.replace(/^\#/, ''));
            } else if (/^\..+/.test(str)) {
                return document.getElementsByClassName(str.replace(/^\./, ''));
            } else {
                return document.getElementsByTagName(str);
            }
        }
    };

    /**
     * @class Be
     * @constructor Be
     * @description Be类
     */
    function Be(option) {
        this.el = tools.$(option.el);
        this.data = option.data || {};

        this.init();
    }

    Be.prototype = {
        constructor: Be,
        /**
         * @method init
         * @description 初始化
         */
        init: function() {
            var _this = this;
            tools.addEvent(this.el.querySelectorAll('[b-model]'), 'input', function (e) {
                var name = e.target.getAttribute('b-model');
                _this[name] = e.target.value;
                _this.data[name] = e.target.value;
            })

            for(var p in this.data) {
                _this.monitorData(this, p, this.data[p]);
            }

            _this.setHtml();
            _this.setModel();
        },
        /**
         * @method monitorData
         * @param data object 实例对象
         * @param name string 属性名
         * @param value 默认值
         * @description 数据监控
         */
        monitorData: function(data, name, value) {
            var _value = value || '',
                _this = this;
            
            Object.defineProperty(data, name, {
                get: function() {
                    return _value;
                },
                set: function(newVal) {
                    _value = newVal;
                    _this.setHtml();
                    _this.setModel();
                },
                enumerable: true,
                configurable: true
            })
        },
        /**
         * @method setHtml
         * @description 处理html b-text属性，进行数据绑定
         */
        setHtml: function() {
            var _this = this;
            var els = this.el.querySelectorAll('[b-text]');
            var name = '';

            for (var i = 0, len = els.length; i < len; i++) {
                name = els[i].getAttribute('b-text');
                els[i].innerHTML = this[name];
            }
        },
        /**
         * @method setModel
         * @description 设置html b-model属性，并对数据进行双向绑定
         */
        setModel: function() {
            var _this = this;
            var els = this.el.querySelectorAll('[b-model]');
            var name = '';

            for (var i = 0, len = els.length; i < len; i++) {
                name = els[i].getAttribute('b-model');
                els[i].value = this[name];
            }
        }
    }

    return Be;
})(window, document);