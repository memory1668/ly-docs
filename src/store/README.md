Vuex 应用状态管理
 --- 

### 基本原理
参考：https://vuex.vuejs.org/zh/

视图、数据、状态、操作等的变更过程：

````
[Vue Components]  --dispatch--> [Actions] --Commit--> [Mutations] --Mutate--> [State]
    ^                                                                            |
    |                                                                            |
    --------------------------Render----------------------------------------------
````   
其中的 Actions、Mutations、State 和对应的操作构成了 Vuex

### 带命名空间
通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

所以使用上才会变成：this.$store.dispatch('user/login', this.loginForm)

其中 'user/login' 中的 'user/' 是因为模块加了 namespaced: true 而自动调整的命名所自动添加上的。
