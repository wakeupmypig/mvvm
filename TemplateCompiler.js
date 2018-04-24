// 解析模板  创建一个模板编译工具
// 做公交
class TemplateCompiler {
    // 把模板放入内存中
    constructor(el, vm) {
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        this.vm = vm;
        // 缓存重要属性

        // 判断视图存在
        // 1.把内容放入到内存中
        if(this.el){
            var fragment = this.node2fragment(this.el);

            this.compile(fragment);

            this.el.appendChild(fragment);
        }
       
        // 2.解析模板
        // 3.把内存的结果 返回到页面上

    }
    //**************工具方法************ */
    isElementNode(node){
        return node.nodeType === 1;// 元素节点 属性节点 文本节点
    }
    isText(node) {
        return node.nodeType === 3;// 元素节点 属性节点 文本节点
    }
    isDirective(attrName){
        return attrName.includes('v-');
    }
    //************* 核心方法************ */
    node2fragment(node){
        // 1.创建内存片段
        var fragment = document.createDocumentFragment();
        // 2.把模板内容丢到内存中
        var child ;
        while (child = node.firstChild ){
            fragment.appendChild(child);
        }
        return fragment;
        // 3.返回即可
    }
    compileElement(node){
        // 找到所有节点
        var arrs = node.attributes;
        // 遍历当前元素所有属性
        Array.from(arrs).forEach(arr=>{
            var arrName = arr.name;
            // 是否是指令
            if (this.isDirective(arrName)){
                var [, type] = arrName.split('-');
                var expr = arr.value;
                CompilerUtils[type](node, this.vm,expr);
            }
        })
    }
    compileText(node, expr){
        CompilerUtils['text'](node, this.vm, expr);
    }
    compile(parent){
        // 1.获取节点
        let childNodes = parent.childNodes;
        // 遍历每一个节点 判断节点类型
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                this.compileElement(node);
            } else {
                var textReg = /\{\{(.+)\}\}/g
                var expr = node.textContent;
                if (textReg.test(expr)) {
                    console.log(expr)
                    expr = RegExp.$1;
                    this.compileText(node, expr);
                }
            }
        });
        // 解析指令
        // 如果还有子节点 继续解析
 
    }
}
CompilerUtils = {
    // 解析text指令
    text(node,vm,expr){
        var updaterFn = this.updater['textUpdater'];
        console.log(vm)
        updaterFn && updaterFn(node,vm.$data[expr]);

        new Watcher(vm,expr,(newValue)=>{
            updaterFn && updaterFn(node, vm.$data[expr]);
        })
    },
    model(node, vm, expr){
        var updaterFn = this.updater['modelUpdater'];
        updaterFn && updaterFn(node, vm.$data[expr]);

        new Watcher(vm, expr, (newValue) => {
            updaterFn && updaterFn(node, vm.$data[expr]);
        });

        // 视图到模型
        node.addEventListener('input',(e)=>{
            var newValue = e.target.value;
            vm.$data[expr] = newValue;
        })


    },
    updater:{
        // 文本更新方法
        textUpdater(node,value){
            node.textContent = value;
        },
        modelUpdater(node, value) {
            node.value = value;
        }
    }

    // 1.找到更新规则对象 
    // 2.执行方法
}