> Copy from [here](https://github.com/huiyan-fe/react-bmapgl/tree/master/types)
# types 类型声明文件

> 为什么👴🏻通过npm安装了`@types/bmapgl`，这儿还有一个`types/bmapgl`呢？

这里的`types`文件可以简单理解为配合开发过程中的使用的类型声明文件。事实上，`@types/bmapgl`里的发布内容就是来自该目录下的这套类型声明文件，只不过有一些GL版JSAPI的类不够齐全，所以可能随时需要补充，所以会先实时编辑该目录下的文件，等到稳定了再发布`@types/bmapgl`同步一下。

> 如上面所说，为什么还需要安装`@types/bmapgl`呢？直接使用这个目录不就可以了吗？

事实上的确是这样的，不过有一个小小的细节差别。在文档自动生成的时候，`styleguidist`会自动读到`@types/bmapgl`里的内容，从而识别出来对象的特殊类型，而只有该目录的话，文档生成的时候只会识别出来是any类型。  
举个例子，我们定义了`map`对象为`BMapGL.Map`的类型，我们希望文档生成后，能够在`type`字段也如此显示，但是这就需要我们手动在组件内部到处写`import bmapgl.core.d.ts`，像狗皮膏药一样，而安装`@types/bmapgl`之后就可以省略这些狗皮膏药。
