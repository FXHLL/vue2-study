(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  // _c()
  function createElementVNode(vm, tag, data) {
    if (data === null) {
      data = {};
    }
    var key = data.key;
    if (key) {
      delete data.key;
    }
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }

  // _v()
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function vnode(vm, tagName, key, data, children, text) {
    return {
      vm: vm,
      tagName: tagName,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  /* 
    dep是属性管理watcher的实例
  */
  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = [];
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        Dep.target.addDep(this); // 访问全局变量里的watcher，完成watcher对dep的收集，dep对watcher的收集
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher); // dep收集watcher
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        }); // 通知watcher更新
      }
    }]);
    return Dep;
  }();
  var stack$1 = [];
  function pushTarget(watcher) {
    stack$1.push(watcher);
    Dep.target = watcher;
  }
  function popTarget(watcher) {
    stack$1.pop();
    Dep.target = stack$1[stack$1.length - 1];
  }

  var id = 0;
  var Watch = /*#__PURE__*/function () {
    function Watch(vm, exprOrFn, options, cb) {
      _classCallCheck(this, Watch);
      this.id = id++;
      this.renderWatcher = options;
      this.getter = typeof exprOrFn === 'string' ? function () {
        return vm[exprOrFn];
      } //用户Watch,访问vm[exprOrFn]收集此watcher
      : exprOrFn;
      this.deps = [];
      this.cb = cb; // 用户Watch传入函数 
      this.depsId = new Set();
      this.lazy = options.lazy;
      this.dirty = this.lazy; // computed取值由脏值决定
      this.vm = vm;
      this.user = options.user;
      this.value = this.lazy ? undefined : this.get(); // 缓存Watch旧值
    }

    // 执行函数
    _createClass(Watch, [{
      key: "get",
      value: function get() {
        pushTarget(this); // watcher内函数执行，装载入全局变量使依赖收集
        console.log(this.getter);
        var value = this.getter.call(this.vm);
        popTarget();
        return value;
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        // computed取值并清空脏值
        this.value = this.get();
        this.dirty = false;
      }

      // watcher收集dep
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this); //dep收集watcher
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;
        while (i--) {
          this.deps[i].depend();
        }
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true; // 依赖更新时计算watcher需要标记为脏值
        } else {
          queueWatcher(this); // 异步队列执行函数
        }
      }
    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value;
        var newValue = this.get();
        if (this.user) {
          this.cb.call(this.vm, newValue, oldValue);
        }
      }
    }]);
    return Watch;
  }();
  var queue = [];
  var has = {};
  var pending = false;
  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(function (q) {
      return q.run();
    });
  }

  /* 
    下一轮宏任务之前的watcher.update都存在闭包queue，再执行前都可以加入队列
  */
  function queueWatcher(watcher) {
    var id = watcher.id;
    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;
    }
    if (!pending) {
      vm.$nextTick(flushSchedulerQueue, 0);
      pending = true;
    }
  }
  var callbacks = [];
  var waiting = false;
  function flushCallbacks() {
    waiting = false;
    var cbs = callbacks.slice(0);
    callbacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  }
  var timeFn;
  if (Promise) {
    timeFn = function timeFn() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    var observe$1 = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observe$1.observe(textNode, {
      characterData: true
    });
    timeFn = function timeFn() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timeFn = function timeFn() {
      setImmediate(flushCallbacks);
    };
  } else {
    timeFn = function timeFn() {
      setTimeout(flushCallbacks, 0);
    };
  }
  function nextTick(cb) {
    callbacks.push(cb);
    if (!waiting) {
      timeFn();
      waiting = true;
    }
  }

  function patchProps(el, props) {
    for (var key in props) {
      if (key === 'style') {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }
  function createEl(vnode) {
    var tagName = vnode.tagName,
      data = vnode.data,
      children = vnode.children,
      text = vnode.text;
    if (typeof tagName === 'string') {
      vnode.el = document.createElement(tagName);
      patchProps(vnode.el, data);
      children.forEach(function (item) {
        vnode.el.appendChild(createEl(item));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }

  /* 
    path:
    对传入的新旧节点判断
    若旧节点为真实元素则为初次渲染，找到真实元素父级，挂载vnode生成的dom
  */
  function path(oldVNode, vnode) {
    var isRealElement = oldVNode.nodeType;
    if (isRealElement) {
      var el = oldVNode;
      var parentEl = el.parentNode;
      var newEl = createEl(vnode);
      parentEl.insertBefore(newEl, el.nextSibing); //插入下个兄弟节点前
      parentEl.removeChild(el);
      return newEl;
    }
  }
  function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      vm.$el = path(el, vnode); // 视图更新后，更新vm.$el值
    };

    Vue.prototype._render = function () {
      var vm = this;
      return vm.$options.render.call(vm);
    };
    Vue.prototype._c = function (value) {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._v = function (value) {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      if (_typeof(value) === 'object') {
        return JSON.stringify(value);
      }
      return value;
    };
  }
  function mountComponent(vm, el) {
    /* 
      1.定义updateComponent: 将render生成的vnode通过path转换为真实元素并挂载
      2.将updateComponent注册到watch,当依赖变化后会自动更新视图
    */
    vm.$el = el;
    var updateComponent = function updateComponent() {
      var vnode = vm._render();
      vm._update(vnode);
    };
    new Watch(vm, updateComponent, true); // true用于标识watcher
  }

  function callHook(vm, hook) {
    // 生命周期函数执行
    var handlers = vm.$options[hook];
    if (handlers) {
      handlers.forEach(function (handler) {
        return handler.call(vm);
      });
    }
  }

  // 原型嫁接，在中间重写同名原型方法
  var oldArrayProtoMethods = Array.prototype;
  var ArrayMethods = Object.create(oldArrayProtoMethods);
  var methods = ['push', 'pop', 'unshift', 'shift', 'splice'];

  // 数组劫持
  methods.forEach(function (item) {
    ArrayMethods[item] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = oldArrayProtoMethods[item].apply(this, args);
      var inserted; // 记录数组新增项
      switch (item) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.splice(2);
          break;
      }
      var ob = this.__ob__;
      if (inserted) {
        // 对新增项的代理
        ob.observerArray(inserted);
      }
      ob.dep.notify(); //通知更新
      return result;
    };
  });

  function observe(data) {
    if (_typeof(data) !== 'object' || data == null) {
      return; // 只对对象代理
    }

    if (data.__ob__ instanceof Observer) {
      // 代理过了
      return data.__ob__;
    }
    return new Observer(data);
  }
  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      this.dep = new Dep(); // 对象本身的dep
      Object.defineProperty(data, '__ob__', {
        // __ob__指向实例，可以取到对象的dep，还有标识作用
        enumerable: false,
        value: this
      });
      // console.log('层级代理', data)
      if (Array.isArray(data)) {
        // 数组代理
        data.__proto__ = ArrayMethods;
        this.observerArray(data);
      } else {
        // 对象代理
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var value = data[key];
          defineReactive(data, key, value);
        }
      }
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        for (var i = 0; i < data.length; i++) {
          observe(data[i]);
        }
      }
    }]);
    return Observer;
  }();
  function defineReactive(data, key, value) {
    var childOb = observe(value); // 递归此逻辑 + 返回对象的dep
    var dep = new Dep(); // 属性的dep
    Object.defineProperty(data, key, {
      get: function get() {
        console.log("".concat(key, "  \u88AB\u8BBF\u95EE"));
        /* 
          watcher与dep的双向收集
          此处属性dep和对象dep是同步收集的，
          即保证了watcher的收集是一致的
          所以使得数组新增后通过__ob__属性访问到数组对应的Observer实例
          从而拿到dep属性进行watcher的通知
        */
        if (Dep.target) {
          dep.depend(); //属性dep
          if (childOb) {
            childOb.dep.depend(); // 对象dep
            if (Array.isArray(value)) {
              //子集数组的dep收集
              dependArray(value);
            }
          }
        }
        return value;
      },
      set: function set(newValue) {
        if (key === 'pid') debugger;
        console.log("".concat(key, "  \u88AB\u8BBE\u7F6E  ").concat(newValue));
        if (newValue === value) return value;
        observe(newValue); // 新值可能需要代理
        value = newValue;
        dep.notify(); // watcher执行
      }
    });
  }

  // 层级数组依赖收集
  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();
      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function initState(vm) {
    var opts = vm.$options;
    //判断
    if (opts.props) ;
    if (opts.data) {
      initData(vm);
    }
    if (opts.computed) {
      initComputed(vm);
    }
    if (opts.watch) {
      initWatch(vm);
    }
    if (opts.methods) ;
  }
  function initData(vm) {
    console.log('init data');
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // data属性代理到实例
    for (var key in data) {
      proxy(vm, key);
    }
    // 设置劫持
    observe(data);
  }
  function initWatch(vm) {
    var watch = vm.$options.watch;
    for (var key in watch) {
      var handler = watch[key]; // 字符串 数组 函数
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }
  function createWatcher(vm, key, handler) {
    // 字符串  函数
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(key, handler);
  }
  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = {}; // 将计算属性watcher保存到vm上
    for (var key in computed) {
      var userDef = computed[key];

      // 函数和对象形式
      var fn = typeof userDef === 'function' ? userDef : userDef.get;

      // 计算属性watcher
      watchers[key] = new Watch(vm, fn, {
        lazy: true
      });
      defineComputed(vm, key, userDef);
    }
  }
  function defineComputed(vm, key, userDef) {
    var setter = userDef.set || function () {};

    // 挂载vm且设置代理
    Object.defineProperty(vm, key, {
      get: createComputedGetter(key),
      set: setter
    });
  }

  // 脏值求值，非脏值取缓存
  function createComputedGetter(key) {
    return function () {
      var watcher = this._computedWatchers[key]; // 获取到对应属性的watcher
      if (watcher.dirty) {
        // 脏值则更新
        watcher.evaluate();
      }
      /* 
        如果Dep.target在计算watcher出栈后还存在，说明了前一个watcher的get()中包含了此计算watcher的get()
        说明前一个watcher执行时访问了计算属性，说明计算属性也是这个watcher的依赖
        所以需要在计算属性的watcher中拿到计算属性的依赖的dep,用他们的dep存储前一个watcher
          即计算属性中的依赖收集了计算属性的watcher,和用到了计算属性的watcher
      */
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value; // 最后返回的是watcher上的值
    };
  }
  function proxy(vm, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm._data[key];
      },
      set: function set(newValue) {
        vm._data[key] = newValue;
      }
    });
  }
  function initStateMixin(Vue) {
    Vue.prototype.$nextTick = nextTick;
    Vue.prototype.$watch = function (exprOrFn, cb) {
      // watch注册的变量变化了则执行cb函数
      new Watch(this, exprOrFn, {
        user: true
      }, cb);
    };
  }

  // * 0或多  + 1或多  ? 0或1  (?:)不捕获分组  [^xx]除xx以外 \s空白符 
  var ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'; // 标签名
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // (?:${ncame}\\:)? xml的命名空间
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 捕获开始标签名
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 捕获 key=value 或 key
  var startTagClose = /^\s*(\/?)>/; // 捕获开始标签结束
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>*")); // 捕获结束标签名

  // 生成 对应 ast对象
  var root; // 根元素
  var createParent; // 栈顶元素
  var stack = [];
  function createASTElement(tagName, attrs) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var text = arguments.length > 3 ? arguments[3] : undefined;
    return {
      tagName: tagName,
      attrs: attrs,
      children: [],
      type: type,
      text: text,
      parent: null
    };
  }
  function start(tagName, attrs) {
    var element = createASTElement(tagName, attrs);
    if (!root) {
      root = element;
    }
    createParent = element;
    stack.push(element);
  }
  function charts(text) {
    text = text.replace(/s/g, '');
    if (text) {
      createParent.children.push({
        type: 3,
        text: text,
        parent: createParent
      });
    }
  }
  function end(tagName) {
    var element = stack.pop(); //元素闭合出栈
    createParent = stack[stack.length - 1];
    if (createParent) {
      //处理元素层级
      element.parent = createParent.tagName;
      createParent.children.push(element);
    }
  }

  // html捕获
  function parseHTML(html) {
    // <div id="app"><span>number:{{a}}</span><span>...</span></div>
    /* 
      搜索html字符串中 < 的位置，判断当前字符串内容
      1.textEnd === 0 标签
      2.textEnd > 0 文本或注释 + 标签
      3.textEnd < 0 文本或注释或空
    */
    while (html) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // debugger
        // 开始标签
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
        }
        // 结束标签
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
        }
        continue;
      }
      if (textEnd > 0) {
        var text = html.slice(0, textEnd);
        if (text) {
          advance(text.length);
          charts(text);
        }
      }
    }
    // 解析开始标签
    function parseStartTag() {
      var start = html.match(startTagOpen); // T:匹配内容 捕获组1...  F:null
      if (!start) return;
      var match = {
        tagName: start[1],
        attrs: []
      };
      advance(start[0].length);
      var attr;
      var end;
      // 没匹配闭合标签且匹配到了属性
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        });
        advance(attr[0].length);
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    // 字符串删除
    function advance(n) {
      html = html.slice(n);
    }
    return root;
  }

  function codegen(ast) {
    var tagName = ast.tagName;
    var attrObj = ast.attrs.length ? genProps(ast.attrs) : 'null';
    var children = ast.children.length ? "".concat(genChildren(ast.children)) : '';
    var code = "_c(\"".concat(tagName, "\",").concat(attrObj, ",").concat(children, ")");
    return code;
  }
  function genProps(attrs) {
    var str = '';
    var _loop = function _loop() {
      var attr = attrs[i];
      if (attr.name === 'style') {
        var obj = {};
        attr.value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value;
        });
        attr.value = obj;
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    return "{".concat(str.slice(0, -1), "}");
  }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 捕获插值表达式内变量

  function genChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(',');
  }
  function gen(node) {
    if (node.type === 1) {
      return codegen(node);
    } else {
      var text = node.text;
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        // 插值表达式解析
        var tokens = [];
        var match;
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0; // 记录上一次匹配index+匹配长度
        while (match = defaultTagRE.exec(text)) {
          var index = match.index; //当前匹配位置
          if (index > lastIndex) {
            // ---{{data}} 取---
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          // {{data}}--- 取---
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  /* 
    1.html字符串->ast语法树
    对html字符串进行match,将匹配内容删除，将捕获内容传入对应节点分类的函数生成ast语法树
    2.ast语法树->变成render
    ast->拼接字符串->函数
  */
  function compileToFunction(el) {
    var ast = parseHTML(el);
    console.log('ast:', ast);
    var code = codegen(ast);
    console.log(code);
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code);
    return render;
  }

  var strats = {};
  var LIFECYCLE_hook = ['beforeCreate', 'created'];
  LIFECYCLE_hook.forEach(function (hook) {
    /* 
      初始：旧：undefined 新：fn 返回 [fn]
      旧：[fn] 新：undefined 返回 [fn]
      旧：[fn] 新：fn 返回 [fn,fn]
    */
    strats[hook] = function (p, c) {
      if (c) {
        if (p) {
          return p.concat(c);
        } else {
          return [c];
        }
      } else {
        return p;
      }
    };
  });
  function mergeOptions(parent, child) {
    var options = {};
    for (var key in parent) {
      mergeField(key);
    }
    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        // 相同属性已经设置过
        mergeField(_key);
      }
    }
    function mergeField(key) {
      if (strats[key]) {
        // 生命周期选项
        options[key] = strats[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key]; // 优先取新选项
      }
    }

    return options;
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = mergeOptions(this.constructor.options, options); // 合并选项
      callHook(vm, 'beforeCreate');
      // 初始化 data computed watcher
      initState(vm);
      // 渲染模板
      callHook(vm, 'created');
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
    //创建 $mount
    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var options = vm.$options;
      // render 比 template 优先级高
      if (!options.render) {
        var template;
        if (!options.template && el) {
          //没template
          template = el.outerHTML;
        } else {
          if (el) {
            // 有template
            template = options.template;
          }
        }
        if (template && el) {
          var render = compileToFunction(template);
          options.render = render;
        }
      }
      mountComponent(vm, el);
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};
    Vue.mixin = function (mixin) {
      // 将传入选项和全局选项进行合并
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function Vue(options) {
    //初始化
    this._init(options);
  }
  initMixin(Vue);
  initLifeCycle(Vue);
  initGlobalAPI(Vue);
  initStateMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
