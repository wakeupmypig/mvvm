// 解析视图模板  模板编译工具
class MVVM {
    constructor(options){
        this.$vm = this; // 层级关系复杂
        this.$el = options.el;
        this.$data = options.data;
        // 判断视图必须存在
        if(this.$el){
            // 创建模板编译器 来解析视图
            // 添加属性观察对象
            new Observer(this.$data);
            this.$compiler = new TemplateCompiler(this.$el,this.$vm);
        }
    }
}