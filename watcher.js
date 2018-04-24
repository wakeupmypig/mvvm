class Watcher {
    //构造函数
    // node 需要使用订阅功能的节点
    // 全局vm对象
    // 
    constructor(vm,expr,cb){
        this.expr = expr;
        this.vm = vm;
        this.cb = cb;
        // 缓存重要属性
        // 缓存当前值
        this.value = this.get(); // 缓存当前值
    }
    // 获取值,获取最新值
    get(){
        // 把当前订阅者添加到全局
        Dep.target = this;
        var value = this.vm.$data[this.expr];
        Dep.target = null;
        return value;
    }
    // 提供一个更新方法（应对发布后要做的事情）
    update(){
        // 获取新值和老
        var newValue = this.vm.$data[this.expr];
        var oldValue = this.value;
        if(newValue!==oldValue){
            this.cb.call(this.vm,newValue)
        }
    }
}