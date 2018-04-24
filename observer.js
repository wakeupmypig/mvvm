class Observer{
    // 构造函数
    constructor(data){
        // 直接提供一个解析方法，完成属性的分析和 挟持
        this.observe(data);
    }
    // 解析数据 ，完成对象数据属性的挟持 控制对象的getter和setter方法
    observe(data){
        // 必须是对象
        if(!data || typeof data!=='object'){
            return;
        }
        var keys = Object.keys(data);
        keys.forEach(key=>{
            this.defineReactive(data,key,data[key]);
        })
    }
    defineReactive(obj,key,val){
        var dep = new Dep();
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:false,
            get(){
                // 针对watcher创建时 直接添加到观察者中
                Dep.target && dep.addSub(Dep.target);
                return val;
            },
            set(newValue){
                val = newValue;
                dep.notify();
            }
        })
    }
}
// 发布者 1.管理订阅者  2.通知
class Dep{
    // 构造函数 
    constructor(){
        this.subs = [];
    }
    // 添加成订阅者
    addSub(sub){
        this.subs.push(sub);
    }
    // 集体通知
    notify(){
        this.subs.forEach((sub)=>{
            sub.update();
        })
    }
}